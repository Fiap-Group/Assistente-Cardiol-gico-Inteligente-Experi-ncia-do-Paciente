"""
=============================================================================
Cliente do IBM Watson Assistant — Assistente Cardiológico
=============================================================================
Encapsula a integração com o Watson Assistant v2: autenticação IAM, criação
de sessão por conversa e recuperação automática quando uma sessão expira no
lado do Watson (o serviço encerra sessões inativas depois de alguns minutos).

Cada conversa do app (identificada pelo `sessao_id` do SQLite local) é
mapeada para uma sessão do Watson, cacheada em memória — mesmo padrão de
"estado em memória, não persistente entre reinícios do backend" já usado
neste projeto antes: se o backend Flask reiniciar, a próxima mensagem de
cada conversa simplesmente abre uma sessão nova no Watson (sem quebrar o
app, só perde o contexto de diálogo que o Watson mantinha).

Nota sobre a versão do SDK (`ibm-watson` 11.x): a API v2 atual do Watson
Assistant exige um `environment_id` além do `assistant_id` (conceito de
ambiente draft/live). Em assistants de ambiente único — caso do plano Lite,
usado neste projeto — o `environment_id` é o próprio `assistant_id`. O
método de envio de mensagem com sessão também mudou de nome, de
`message_stateful` (SDKs antigos) para `message`, e passou a exigir um
`user_id` — usamos o próprio `sessao_id` do app como `user_id`, já que ele
identifica a conversa de forma estável.
=============================================================================
"""

import time

from ibm_watson import AssistantV2
from ibm_cloud_sdk_core import ApiException
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator


class WatsonAssistantClient:
    def __init__(self, api_key: str, url: str, assistant_id: str, version: str):
        authenticator = IAMAuthenticator(apikey=api_key)
        self._assistant = AssistantV2(version=version, authenticator=authenticator)
        self._assistant.set_service_url(url)
        self._assistant_id = assistant_id
        self._environment_id = assistant_id  # assistant de ambiente único (plano Lite)
        self._sessions = {}  # sessao_id (app, string) -> session_id (Watson)

    def _criar_sessao_watson(self) -> str:
        resultado = self._assistant.create_session(
            assistant_id=self._assistant_id,
            environment_id=self._environment_id,
        ).get_result()
        return resultado["session_id"]

    def _responder(self, watson_session_id: str, sessao_id: str, texto: str) -> str:
        resultado = self._assistant.message(
            assistant_id=self._assistant_id,
            environment_id=self._environment_id,
            session_id=watson_session_id,
            input={"message_type": "text", "text": texto},
            user_id=sessao_id,
        ).get_result()

        generic = resultado.get("output", {}).get("generic", [])
        partes = [
            item["text"]
            for item in generic
            if item.get("response_type") == "text" and item.get("text")
        ]
        return "\n".join(partes) or "Desculpe, não entendi. Pode reformular a pergunta?"

    def enviar_mensagem(self, sessao_id: str, texto: str) -> str:
        watson_session_id = self._sessions.get(sessao_id)
        if not watson_session_id:
            watson_session_id = self._criar_sessao_watson()
            self._sessions[sessao_id] = watson_session_id

        max_tentativas = 3
        for tentativa in range(max_tentativas):
            try:
                return self._responder(watson_session_id, sessao_id, texto)
            except ApiException as erro:
                # Sessão expirada/inválida no lado do Watson: recria e tenta
                # de novo uma única vez, sem propagar o erro pro app.
                if erro.code in (404, 410):
                    watson_session_id = self._criar_sessao_watson()
                    self._sessions[sessao_id] = watson_session_id
                    return self._responder(watson_session_id, sessao_id, texto)
                raise
            except Exception as erro:
                # Falha transitória de rede/conexão com o IBM Cloud (ex.:
                # "Connection aborted"/"Remote end closed connection"). Não é
                # erro de configuração nem de sessão — vale tentar de novo com
                # backoff curto antes de desistir.
                if not _e_erro_transitorio(erro) or tentativa == max_tentativas - 1:
                    raise
                time.sleep(2**tentativa)  # 1s, 2s
        raise RuntimeError("Falha ao consultar o Watson Assistant após múltiplas tentativas.")


def _e_erro_transitorio(erro: Exception) -> bool:
    texto = str(erro).lower()
    return any(
        marcador in texto
        for marcador in ("connection aborted", "remote end closed", "timeout", "connection reset")
    )


class FakeWatsonAssistantClient:
    """Stub usado quando WATSON_MOCK=true ou faltam credenciais no .env.
    Permite testar o app e o backend Flask de ponta a ponta antes de criar
    a instância real do Watson Assistant no IBM Cloud."""

    def enviar_mensagem(self, sessao_id: str, texto: str) -> str:
        return (
            f'[modo simulado] Você disse: "{texto}". '
            "Configure WATSON_API_KEY, WATSON_URL e WATSON_ASSISTANT_ID no "
            ".env para respostas reais do Watson Assistant."
        )

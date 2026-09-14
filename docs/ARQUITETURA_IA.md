# Arquitetura — Assistente Cardiológico

Documento técnico da integração com o IBM Watson Assistant: como o backend
Flask (`app/backend/api.py`, `app/backend/watson_client.py`) expõe essa
integração pro app, e como o front-end consome tudo isso.

## Visão geral do fluxo

```
App (Expo)
   │  POST /api/chat  { sessao_id, mensagem }
   ▼
Backend Flask (api.py)
   │  get_client() → WatsonAssistantClient (real) ou FakeWatsonAssistantClient (mock)
   ▼
watson_client.py → IBM Watson Assistant v2 (IBM Cloud)
   │  create_session (uma vez por conversa) + message (a cada mensagem)
   ▼
Backend devolve { resposta } → App salva no SQLite local e exibe no chat
```

Toda a "inteligência" de diálogo (entender a pergunta, decidir o que
responder) vive do lado do **Watson Assistant**, configurado separadamente
no IBM Cloud — o backend deste projeto não faz NLP, não tem prompt de LLM
nem base de conhecimento própria. O papel dele é só de **ponte**: autenticar,
gerenciar a sessão da conversa e repassar mensagem/resposta.

## Por que o SDK oficial (`ibm-watson`) em vez de chamadas HTTP manuais

- É a forma documentada pela própria IBM de consumir a API do Watson
  Assistant — evita reimplementar a troca de API key por token IAM
  (`IAMAuthenticator`), incluindo cache e renovação automática do token.
- Reduz drasticamente a superfície de erro comparado a montar requests HTTP
  crus com autenticação manual.

## Nota sobre a versão da API do Watson Assistant

O SDK oficial (`ibm-watson` 11.x) usa a API v2 atual do Watson Assistant,
que introduziu o conceito de **ambiente** (`environment_id`, ex.:
draft/live) além do `assistant_id`, e passou a exigir um `user_id` em toda
chamada de mensagem. Num assistant de ambiente único — caso do plano Lite,
usado neste projeto — o `environment_id` é o próprio `assistant_id`; o
`watson_client.py` já resolve isso automaticamente. O método de envio de
mensagem com sessão também foi renomeado de `message_stateful` (usado em
versões antigas do SDK/documentação) para `message`.

## Gestão de sessão

O Watson Assistant exige uma **sessão** por conversa (`create_session`) —
ela guarda o contexto de diálogo do lado do Watson (o que já foi perguntado,
em que ponto do fluxo o usuário está). Sessões expiram após um período de
inatividade.

- `WatsonAssistantClient` mantém um dicionário em memória
  `{ sessao_id do app → session_id do Watson }`. A primeira mensagem de uma
  conversa cria a sessão; as próximas reaproveitam o mesmo `session_id`.
- **Self-healing de sessão expirada**: se o Watson devolver erro 404/410 ao
  tentar enviar uma mensagem (sessão inválida/expirada), o cliente recria a
  sessão automaticamente e tenta de novo uma única vez, sem propagar o erro
  pro app — o usuário simplesmente recebe a resposta normalmente, só perde
  o contexto de diálogo anterior no lado do Watson.
- **Limitação aceita**: esse cache é em memória do processo Flask — se o
  backend reiniciar, todas as sessões são perdidas e a próxima mensagem de
  cada conversa abre uma sessão nova no Watson (sem quebrar o app; o
  histórico de mensagens do app continua intacto, salvo no SQLite local,
  só o "estado de diálogo" do Watson em si é reiniciado).
- **Retry para falhas transitórias de rede**: chamadas ao IBM Cloud
  ocasionalmente falham por instabilidade de conexão (ex.: "Connection
  aborted"/"Remote end closed connection"), observado durante os testes
  reais deste projeto. `enviar_mensagem()` detecta esse tipo de erro (via
  `_e_erro_transitorio`) e tenta de novo automaticamente, com backoff curto
  (1s, 2s), até 3 tentativas — igual à estratégia usada anteriormente para
  o backend de RAG do projeto anterior. Erros de configuração (credenciais
  inválidas, assistant/environment errados) não são tratados como
  transitórios e falham imediatamente, sem retry inútil.

## Modo simulado (mock)

`FakeWatsonAssistantClient` (`watson_client.py`) é usado automaticamente
quando `WATSON_MOCK=true` ou quando qualquer uma das credenciais
(`WATSON_API_KEY`, `WATSON_URL`, `WATSON_ASSISTANT_ID`) não está preenchida
no `.env`. Ele devolve uma resposta fixa avisando que as credenciais não
foram configuradas — isso permite:

- Testar o app inteiro (Dashboard → Chat → persistência do histórico) sem
  depender de uma instância do Watson Assistant já criada.
- Rodar os testes automatizados (`app/backend/test_api.py`) de forma
  determinística, sem chamadas de rede reais.

O endpoint `GET /api/health` expõe o modo atual (`"watson"` ou `"mock"`),
útil pra confirmar rapidamente qual dos dois está ativo.

## Endpoints

| Método | Rota | Corpo | Resposta |
|---|---|---|---|
| GET | `/api/health` | — | `{"status": "ok", "modo": "watson"\|"mock"}` |
| POST | `/api/chat` | `{"sessao_id": ..., "mensagem": "..."}` | `{"resposta": "..."}` |

Erros de validação (campo faltando) retornam `400`; falha ao consultar o
Watson Assistant retorna `502` com `{"error": ..., "details": ...}`.

## Persistência (frontend)

O histórico de mensagens da conversa fica salvo **localmente no
dispositivo**, via SQLite (`app/src/db/database.js`, `expo-sqlite`) — tabelas
`sessoes_chat` e `mensagens`. Não existe um banco de dados remoto: o backend
Flask não guarda histórico nenhum, ele só repassa mensagem → resposta a cada
chamada.

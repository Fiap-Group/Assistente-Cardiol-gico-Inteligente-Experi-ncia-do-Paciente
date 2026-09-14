# Backend — Assistente Cardiológico

API Flask que repassa mensagens do app para o **IBM Watson Assistant** e
devolve a resposta. Não tem inteligência própria — é só uma ponte
autenticada entre o app e o assistant publicado no IBM Cloud. Arquitetura
completa em `../docs/ARQUITETURA_IA.md`.

## Setup

### Opção A — venv manual

```bash
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# preencha WATSON_API_KEY, WATSON_URL, WATSON_ASSISTANT_ID (opcional — sem
# preencher, a API sobe em modo simulado/mock)

python api.py
```

### Opção B — Docker

```bash
cp .env.example .env
docker compose up --build
```

Em ambos os casos a API sobe em `http://localhost:5000`.

## Variáveis de ambiente (`.env`)

| Variável | Obrigatória | Descrição |
|---|---|---|
| `WATSON_API_KEY` | não* | API key da instância do Watson Assistant |
| `WATSON_URL` | não* | Service URL da instância (região-específica) |
| `WATSON_ASSISTANT_ID` | não* | ID do assistant publicado |
| `WATSON_VERSION` | não | Data de versão da API (padrão `2021-11-27`) |
| `WATSON_MOCK` | não | `true` força modo simulado mesmo com credenciais preenchidas |
| `FLASK_ENV` | não | `development` ativa o modo debug do Flask |
| `PORT` | não | Porta da API (padrão `5000`) |

\* Sem essas três preenchidas, a API cai automaticamente em modo simulado
(mock) — útil pra testar antes de ter a instância do Watson Assistant
criada no IBM Cloud.

## Endpoints

### `GET /api/health`

```bash
curl http://localhost:5000/api/health
# {"status": "ok", "modo": "mock"}   (ou "watson", se as credenciais estiverem configuradas)
```

### `POST /api/chat`

```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"sessao_id": 1, "mensagem": "quais hábitos ajudam a prevenir doenças cardíacas?"}'
# {"resposta": "..."}
```

`sessao_id` identifica a conversa (o app usa o id da sessão salva no SQLite
local) — mensagens com o mesmo `sessao_id` reaproveitam a mesma sessão do
Watson Assistant, preservando o contexto de diálogo.

## Testes

```bash
pip install pytest
pytest test_api.py
```

Os testes (`test_api.py`) rodam sempre em modo mock (`WATSON_MOCK=true`),
sem depender de credenciais reais nem de rede.

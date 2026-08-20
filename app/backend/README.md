# Backend RAG — Genera Intelligence

API que responde perguntas sobre o perfil genômico do paciente usando RAG
(retrieval + LLM). Consumida pelo app React Native (telas "Resumos" e "Chat"
da aba Análise).

## Rodar localmente

```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# edite o .env e preencha UMA das chaves: GEMINI_API_KEY (grátis), ANTHROPIC_API_KEY ou OPENAI_API_KEY

python api.py
```

A API sobe em `http://localhost:5000`. Deixe esse processo rodando junto do
`npx expo start` do app (são dois processos separados).

## Chave de API (obrigatória para `/api/chat`)

O `/api/index` funciona sem chave nenhuma (embeddings rodam localmente via
`sentence-transformers`). Já o `/api/chat` precisa de um LLM real pra escrever
a resposta — escolha uma:

- **Gemini (recomendado, grátis)**: crie uma chave em
  https://aistudio.google.com/apikey (não pede cartão) e coloque em
  `GEMINI_API_KEY` no `.env`.
- **Anthropic** ou **OpenAI** (pagos, créditos pré-pagos): chave em
  https://console.anthropic.com ou https://platform.openai.com.

Sem nenhuma chave configurada, `/api/index` funciona normalmente mas
`/api/chat` retorna erro 500 — é esperado, não é bug.

## Endpoints

- `GET /api/health` — verifica se a API está no ar e se já há paciente indexado.
- `POST /api/index` — indexa o perfil genômico do paciente. Corpo: o JSON no
  formato da Sprint 1 (veja `sample_sprint1_output.json` como exemplo).
- `POST /api/chat` — `{ "question": "..." }` → `{ answer, sources, grounded }`.

## Testar rapidamente com curl

```bash
curl -X POST http://localhost:5000/api/index \
  -H "Content-Type: application/json" \
  -d @sample_sprint1_output.json

curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "Qual meu risco de diabetes?"}'
```

## Arquivos

- `rag_system.py` — pipeline RAG (chunking do JSON genômico, embeddings,
  busca vetorial, geração de resposta com prompt anti-alucinação).
- `api.py` — API Flask que expõe o pipeline acima para o app.
- `sample_sprint1_output.json` — exemplo de relatório genômico para testes.

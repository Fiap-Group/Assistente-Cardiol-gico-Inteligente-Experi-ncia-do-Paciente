# FIAP - Faculdade de Informática e Administração Paulista

# Genera Intelligence — Enterprise Challenge (Dasa)

> **Declaração:** esta solução **não concorre ao prêmio Dasa** e é mantida
> em **sigilo** pela equipe de tutores, conforme a orientação da FIAP. O
> repositório é privado e compartilhado apenas com o perfil `fiap-tutoria`.

## Nome do grupo
41

## 👨‍🎓 Integrantes:
- Guilherme Campos Hermanowski
- Fatima Candal
- Matheus Alboredo Soares
- Jonathan Willian Luft
- Ana Belchior

### Tutor
CaiqueFiap-2026

## 📜 Descrição

App (React Native/Expo, versão web) + backend (Python/Flask + RAG) para o
desafio Dasa/Genera. O paciente envia o próprio relatório genético e conversa
com um agente de IA sobre ele. O agente responde em linguagem simples, com as
fontes do relatório à vista, e sempre com aviso de que a resposta é
informativa e não um diagnóstico.

Funcionalidades: dashboard com cards de risco e resumo de ancestralidade,
navegação entre as seções do perfil, chat com fontes, resumos automáticos,
persistência local e controles de privacidade (consentimento e "apagar meus
dados").

## 🎥 Vídeo de apresentação

[COLOCAR AQUI O LINK DO VÍDEO — publicado como "não listado" no YouTube]

## 🌐 Aplicação em execução (deploy)

- **Front (web):** [COLOCAR AQUI A URL DO FRONT PUBLICADO NO NETLIFY/VERCEL]
- **Backend:** roda no computador da equipe via Docker e é exposto por túnel
  (cloudflared/ngrok) apenas durante a apresentação. O endereço do túnel é
  configurado no front pela variável `EXPO_PUBLIC_API_URL` (ver *Deploy* abaixo).
- **Mobile:** o código é Expo, mas a entrega foi validada na **versão web**.
  Não há APK nem build nativo.

## 📁 Estrutura do projeto

```
docs/
  ARQUITETURA_IA.md              # Escolha do LLM, embeddings, retrieval
  GOVERNANCA_E_RISCOS.md          # Limites do agente, disclaimers, privacidade
  POLITICA_GOVERNANCA_IA.md       # LGPD, ciclo de vida dos dados, logging, explicabilidade
  AVALIACAO_MODELO.md             # Resultados da avaliação contra o gabarito

.github/workflows/ci.yml          # CI: testes do backend a cada push

app/                              # App React Native/Expo (front web)
  src/
    screens/                      # Dashboard, Riscos, Ancestralidade, Resumos, Chat
    components/                   # RiscoCard, ChatBox (com fontes), Dropdown, ...
    db/                           # Persistência local (SQLite) e consentimento
    services/                     # Cliente da API do backend
    utils/                        # Mapeamento de dados do relatório
    theme/, styles/               # Paleta de cores e estilos
  netlify.toml                    # Configuração do deploy estático

  backend/                        # Sistema RAG (backend)
    api.py                        # API Flask: index, chat, reset, health, metrics
    rag_system.py                 # Pipeline: limpeza (NLP), chunking, embeddings, busca, geração
    prompts.py                    # Prompt do agente para leigos e limites do agente
    glossario.py                  # Traduções de termos técnicos para o paciente
    observabilidade.py            # Logs estruturados (JSON) e métricas
    avaliacao/                    # Gabarito, avaliação do modelo e validação das respostas
    scripts/rotina_operacao.py    # Rotina de operação (testes + avaliação + saúde)
    tests/                        # Testes automatizados (sem chamar o LLM)
    Dockerfile, docker-compose.yml
    sample_sprint1_output.json    # Exemplo de relatório genômico
    README.md                     # Documentação específica do backend
```

## 🧠 Evolução da inteligência do projeto

- **Sprint 1** — pipeline de coleta e estruturação dos dados do laudo genômico
  em um JSON padronizado (`app/backend/sample_sprint1_output.json` é um
  exemplo desse formato).
- **Sprint 2** — desenho do pipeline RAG (chunking por domínio semântico,
  embeddings multilíngues, busca vetorial, geração com prompt
  anti-alucinação) e uma interface de demonstração inicial.
- **Sprint 3** — a inteligência foi conectada ao produto: o pipeline RAG virou
  uma API real, consumida por um front funcional. O usuário passou a fornecer
  os próprios dados (formulário na aba Ancestralidade). Entrou o Gemini como
  LLM gratuito, com retry para erros passageiros e mensagens claras quando a
  cota grátis esgota. Resumos e histórico de chat passaram a ser persistidos
  localmente, com exclusão pelo usuário.
- **Sprint 4 (este repositório, versão final)** — a solução foi preparada para
  uso real:
  - **Governança:** política de LGPD com consentimento antes do primeiro envio,
    pseudonimização antes de chamar o LLM, botão "apagar meus dados" e política
    documentada em `docs/POLITICA_GOVERNANCA_IA.md`.
  - **Explicabilidade:** cada resposta mostra as fontes do relatório usadas.
  - **Logging e monitoramento:** eventos em JSON sem texto das perguntas,
    `GET /api/metrics` com latência e contadores, e uma rotina de operação
    agendável.
  - **Avaliação do modelo:** gabarito de 28 perguntas, métricas de recuperação e
    validação automática das respostas (tamanho, clareza, números e jargão).
    Os números estão em `docs/AVALIACAO_MODELO.md`.
  - **Linguagem para leigos:** prompt reescrito com respostas curtas (até 120
    palavras), ordem fixa (resposta → significado → próximo passo), glossário
    de termos técnicos e disclaimer mais curto.
  - **Correções de segurança e de dados:** índice por paciente (um relatório
    substitui o anterior), backend escutando só em `127.0.0.1` por padrão,
    erros internos não expostos ao cliente e CORS restrito à origem do front.

## 🎨 Evolução da experiência do usuário e decisões de interface

- **Sprint 1 → 2**: interface de demonstração (Streamlit) só para validar o
  pipeline RAG por fora, feita para uso interno da equipe.
- **Sprint 3**: interface pensada para o **paciente final**, em abas com
  navegação entre as seções do perfil genético (Dashboard → Riscos →
  Ancestralidade → Análise/Chat):
  - **Dashboard** como porta de entrada, com os destaques (maior risco e
    top-2 ancestralidade) para leitura rápida.
  - **Ancestralidade** virou a tela de entrada de dados: um formulário guiado
    (campos do paciente, linhas dinâmicas de ancestralidade e de risco), no
    lugar de colar JSON cru.
  - **Resumos → Chat**: ao enviar um relatório, o app gera o resumo e leva o
    usuário direto para a conversa.
  - **Estados vazios explicados**: Dashboard e Riscos dizem o que fazer antes
    de existir um relatório.
  - **Exclusão de dados sob controle do usuário**: lixeira em cada resumo, com
    confirmação, que remove resumo, conversa e registros do banco local.
- **Sprint 4**:
  - **Fontes à vista:** "Fontes consultadas no seu relatório" recolhível em
    cada resposta, com nomes de seção em português simples.
  - **Consentimento antes do envio** (texto em linguagem simples, com a
    informação de que parte do texto vai ao serviço do Google).
  - **Botão "Apagar meus dados"** no fim da tela de Ancestralidade.
  - **Respostas para leigos:** respostas curtas, sem jargão sem tradução, com
    uma frase de próximo passo.

### Salvaguardas de comunicação aplicadas

- Disclaimer fixo nas telas **Dashboard** e **Riscos** lembrando que as
  informações são interpretações, não diagnóstico.
- Disclaimer **anexado por código** (não depende do LLM lembrar) ao final de
  toda resposta do chat e de todo resumo automático. Ver
  `docs/GOVERNANCA_E_RISCOS.md`.
- Prompt do agente instrui a tratar risco genético como **fator, não destino**,
  sem linguagem alarmista, e a nunca inventar valor ou percentual que não esteja
  no relatório do próprio usuário.
- Mensagens de erro (backend fora do ar, cota de IA esgotada) são explicadas
  ao usuário, para não confundir indisponibilidade técnica com "não há risco".

### Nota de escopo: resumos cobrem o relatório, não a conversa

O resumo automático (gerado a cada novo relatório enviado) cobre os dados
estruturados do relatório (riscos e ancestralidade). Não é um resumo da conversa
em si. O histórico completo das interações fica preservado no SQLite local, o
que atende ao requisito de persistência. Resumir a conversa foi avaliado e
deixado como evolução futura, para manter o escopo focado no ciclo relatório →
RAG → resposta.

## ✅ Requisitos desta entrega

| Requisito | Onde está |
|---|---|
| Dashboard com cards de risco e resumo de ancestralidade | `app/src/screens/DashboardScreen.js`, `HomeScreen.js` (Riscos) |
| Navegação clara entre seções do perfil genético | abas Dashboard / Riscos / Ancestralidade / Análise (`app/App.js`) |
| Personalização das respostas via RAG | `app/backend/rag_system.py` (`Retriever`, índice por relatório) |
| Simplificação de linguagem (NLP) | `app/backend/prompts.py` (público leigo), `glossario.py`, `TextCleaner` em `rag_system.py` |
| Sistema RAG (busca vetorial + geração fundamentada) | `app/backend/rag_system.py`, detalhado em `docs/ARQUITETURA_IA.md` |
| Resumos automáticos do relatório | `app/src/services/resumoService.js` (ver nota de escopo acima) |
| Comunicação responsável e disclaimers obrigatórios | disclaimer anexado por código em `rag_system.py` (`answer()`) |
| Multimodalidade (opcional) | avaliada e deixada fora do escopo (ver nota abaixo) |
| Persistência de dados e histórico de interações | `app/src/db/database.js` (SQLite local) |
| **Governança de IA: LGPD, explicabilidade e logging** | `docs/POLITICA_GOVERNANCA_IA.md`, `app/backend/observabilidade.py`, consentimento em `ProfileScreen.js` |
| **Monitoramento dos pipelines** | `GET /api/health`, `GET /api/metrics`, `logs/app.log` |
| **Automações de execução (AI for RPA)** | `app/backend/scripts/rotina_operacao.py`, `.github/workflows/ci.yml` |
| **Avaliação do modelo (qualidade e consistência)** | `app/backend/avaliacao/avaliar.py`, `docs/AVALIACAO_MODELO.md` |
| **Validação das respostas** | `app/backend/avaliacao/validacao.py` |
| **Deploy do front** | `app/netlify.toml`, seção *Deploy* abaixo |
| Visão Computacional | não aplicável: não foi utilizada neste projeto |
| Documentação da arquitetura de IA | `docs/ARQUITETURA_IA.md` |
| Relatório de governança e riscos | `docs/GOVERNANCA_E_RISCOS.md` e `docs/POLITICA_GOVERNANCA_IA.md` |
| Apresentação em vídeo | link no topo deste README |
| README final | este arquivo |

**Multimodalidade (opcional):** avaliada e não implementada. Ler gráficos de
imagem de forma confiável (OCR e visão computacional) exige uma frente de
trabalho própria, incompatível com o tempo do Challenge. Nenhum código
relacionado ficou pela metade no repositório.

**Visão Computacional:** não foi utilizada no projeto. Por isso não há
refinamento de visão computacional nesta entrega.

## ▶️ COMO RODAR

O projeto tem **duas partes que rodam ao mesmo tempo, em terminais
separados**: o backend (Python) e o app (Expo). Os dois precisam estar no ar
para o chat e os resumos funcionarem.

### 1. Backend (API RAG)

Você precisa de uma chave do Gemini (gratuita, sem cartão):
https://aistudio.google.com/apikey

**Opção A: Docker (recomendada, não exige Python instalado)**

```bash
cd app/backend
cp .env.example .env          # preencha GEMINI_API_KEY
docker compose up --build
```

A primeira execução baixa o modelo de embeddings e pode levar alguns minutos.
O backend fica disponível em `http://localhost:5000`.

**Opção B: venv manual**

```bash
cd app/backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env             # preencha GEMINI_API_KEY
python api.py
```

### 2. App (Expo, versão web)

Em outro terminal:

```bash
cd app
npm install
npx expo start --web
```

O terminal mostra o link, geralmente `http://localhost:8081`.

### 3. Testar o fluxo completo

1. Abra a aba **Ancestralidade**. Clique em **"Usar exemplo"** (ou preencha os campos).
2. Clique em **"Enviar relatório"** e autorize o uso dos dados. O app indexa o
   relatório, gera um resumo e leva você para o **Chat**.
3. Faça uma pergunta, por exemplo: *"Tenho risco de diabetes?"*. A resposta
   vem curta, com um botão **"Fontes consultadas no seu relatório"**.
4. Confira as abas **Riscos** e **Dashboard**. Elas refletem o relatório enviado.
5. Em **Ancestralidade**, use **"Apagar meus dados"** para remover tudo deste
   dispositivo e do backend.

### 4. Testes, avaliação e rotina de operação

```bash
cd app/backend
pip install pytest
pytest tests/                                   # testes unitários, sem LLM
python avaliacao/avaliar.py                      # avaliação de recuperação, sem LLM
python avaliacao/avaliar.py --com-llm --limite 10   # também avalia as respostas (usa cota do Gemini)
python scripts/rotina_operacao.py               # roda tudo e grava logs/rotina_operacao.json
```

A rotina pode ser agendada com cron (Linux/macOS) ou o Agendador de Tarefas
(Windows). O CI do GitHub roda os testes a cada push.

## 🚀 Deploy

**Front (web, na nuvem gratuita):**

1. Gere o build: `cd app && npx expo export -p web` (saída em `app/dist/`).
2. Publique no **Netlify** (ou Vercel). O `app/netlify.toml` já traz o comando
   de build e as rotas.
3. Em *Site settings → Environment variables*, defina `EXPO_PUBLIC_API_URL` com a
   URL do túnel do backend, e refaça o deploy.

**Backend (no seu computador, durante a apresentação):**

1. Suba o backend com `docker compose up` (ou `python api.py`).
2. Exponha a porta 5000 com um túnel:
   ```bash
   cloudflared tunnel --url http://localhost:5000
   # ou: ngrok http 5000
   ```
3. Em `app/backend/.env`, adicione a URL publicada do front em `CORS_ORIGINS`
   (ex.: `CORS_ORIGINS=https://seu-site.netlify.app`) e reinicie o backend.

**Antes de publicar:** troque a chave do Gemini e quaisquer credenciais que
tenham sido compartilhadas fora do `.env`. O `.env` está no `.gitignore` e não
vai para o repositório.

## 📋 Licença

<img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1"><p xmlns:cc="http://creativecommons.org/ns#" xmlns:dct="http://purl.org/dc/terms/"><a property="dct:title" rel="cc:attributionURL" href="https://github.com/agodoi/template">MODELO GIT FIAP</a> por <a rel="cc:attributionURL dct:creator" property="cc:attributionName" href="https://fiap.com.br">Fiap</a> está licenciado sobre <a href="http://creativecommons.org/licenses/by/4.0/?ref=chooser-v1" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">Attribution 4.0 International</a>.</p>

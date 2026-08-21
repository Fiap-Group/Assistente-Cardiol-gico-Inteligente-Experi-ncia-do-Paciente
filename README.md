# FIAP - Faculdade de Informática e Administração Paulista

# Genera Intelligence — Enterprise Challenge (Dasa)

## Nome do grupo
41

## 👨‍🎓 Integrantes:
- Guilherme Campos Hermanowski
- Fatima Candal
- Matheus Alboredo Soares
- Jonathan Willian Luft
- Ana Belchior

## 📜 Descrição

App (React Native/Expo) + backend (Python/Flask + RAG) para o desafio
Dasa/Genera: dashboard com cards de risco genético e resumo de
ancestralidade, navegação clara entre as seções do perfil genético, chat com
um agente de IA (RAG) sobre o próprio relatório enviado pelo usuário, geração
automática de resumos a cada novo relatório e persistência local de dados e
histórico de interações.

## 🎥 Vídeo de apresentação

[COLOCAR AQUI O LINK DO VÍDEO — publicado como "não listado"]

## 📁 Estrutura do projeto

```
docs/                          # Documentação de arquitetura e governança
  ARQUITETURA_IA.md             # Escolha do LLM, embeddings, retrieval
  GOVERNANCA_E_RISCOS.md         # Limites do agente, disclaimers, privacidade

app/                            # App React Native/Expo (frontend)
  src/
    screens/                     # Dashboard, Riscos, Ancestralidade, Resumos, Chat
    components/                   # RiscoCard, AncestralidadeBarra, ChatBox, Dropdown, ...
    db/                            # Persistência local (SQLite)
    services/                       # Cliente da API do backend
    utils/                           # Mapeamento de dados do relatório genômico
    theme/, styles/                  # Paleta de cores e estilos

  backend/                       # Sistema RAG (backend)
    rag_system.py                 # Pipeline: limpeza (NLP), chunking, embeddings, busca, geração
    prompts.py                     # Configuração dos prompts do agente
    api.py                         # API Flask que expõe o pipeline pro app
    sample_sprint1_output.json      # Exemplo de relatório genômico
    README.md                       # Documentação específica do backend
```

## 🧠 Evolução da inteligência do projeto

- **Sprint 1** — pipeline de coleta/estruturação dos dados do laudo genômico
  em um JSON padronizado (`app/backend/sample_sprint1_output.json` é um
  exemplo desse formato).
- **Sprint 2** — desenho do pipeline RAG (chunking por domínio semântico,
  embeddings multilíngues, busca vetorial, geração com prompt
  anti-alucinação) e uma interface de demonstração inicial.
- **Sprint 3 (este repositório)** — a inteligência foi **conectada de
  verdade** ao produto: o pipeline RAG virou uma API real (`api.py`),
  consumida por um front-end funcional (React Native/Expo, web e mobile);
  o usuário passou a **fornecer seus próprios dados** (formulário na aba
  Ancestralidade, não mais só um exemplo fixo); foi adicionado suporte a
  **Gemini** como LLM gratuito (com retry automático para erros passageiros
  e mensagens claras quando a cota grátis esgota); os resumos automáticos e
  o histórico de chat passaram a ser **persistidos localmente** (SQLite),
  com controle do usuário para excluir dados (lixeira nos cards de resumo).

## 🎨 Evolução da experiência do usuário e decisões de interface

- **Sprint 1 → 2**: interface de demonstração (Streamlit) só para validar o
  pipeline RAG por fora — sem preocupação de UX, feita pra uso interno da
  equipe.
- **Sprint 3 (este app)**: interface pensada para o **paciente final**,
  organizada em abas com navegação clara entre as seções do perfil genético
  (Dashboard → Riscos → Ancestralidade → Análise/Chat):
  - **Dashboard** como porta de entrada, com os destaques (maior risco +
    top-2 ancestralidade) para leitura rápida, sem exigir que o usuário
    navegue por tudo pra entender o essencial.
  - **Ancestralidade** virou a tela de **entrada de dados**: o que antes era
    colar um JSON cru virou um **formulário guiado** (campos de paciente,
    linhas dinâmicas de ancestralidade e de risco), reduzindo erro de
    formato e tornando o fluxo acessível a quem não sabe o que é JSON.
  - **Resumos → Chat**: ao enviar um relatório, o app já gera o resumo e
    **leva o usuário direto para a conversa**, em vez de deixar ele procurar
    onde foi parar a resposta — menos passos entre a ação e o resultado.
  - **Estados vazios explicados**: Dashboard e Riscos, antes de qualquer
    relatório ser enviado, mostram uma frase apontando o que fazer
    ("vá até Ancestralidade e envie seu relatório"), em vez de tela em
    branco ou dado quebrado.
  - **Exclusão de dados visível e no controle do usuário**: ícone de lixeira
    em cada card de resumo, com confirmação antes de apagar — remove
    resumo, conversa e registros do banco local juntos, sem depender de
    suporte.
  - **Multimodalidade (entrada por imagem)** foi avaliada e **conscientemente
    deixada fora do escopo** desta entrega: é um requisito opcional do
    enunciado, e implementar leitura de gráfico por imagem de forma
    confiável (OCR/visão computacional) exigiria uma frente de trabalho
    própria incompatível com o tempo da sprint. Nenhum código relacionado
    ficou pela metade no repositório.

### Salvaguardas de comunicação aplicadas

- Disclaimer fixo nas telas **Dashboard** e **Riscos** lembrando que as
  informações são interpretações, não diagnóstico.
- Disclaimer **anexado por código** (não depende do LLM lembrar) ao final de
  toda resposta do chat e de todo resumo automático — ver
  `docs/GOVERNANCA_E_RISCOS.md`.
- Prompt do agente instrui explicitamente a contextualizar risco genético
  como **fator, não destino**, evitando linguagem alarmista, e a nunca
  inventar valor/percentual/gene que não esteja no relatório do próprio
  usuário.
- Mensagens de erro (backend fora do ar, cota de IA esgotada) são sempre
  explicadas ao usuário, para não confundir indisponibilidade técnica com
  "não há risco".

### Nota de escopo: resumos cobrem o relatório, não a conversa

O resumo automático (gerado a cada novo relatório enviado) cobre os dados
**estruturados do relatório** (riscos + ancestralidade) — não é um resumo da
conversa do chat em si. O **histórico completo das interações** fica
preservado e acessível a qualquer momento (SQLite local, tela de Chat),
satisfazendo o requisito de persistência do histórico; resumir a conversa
em si (ex: "resumir esta conversa") foi avaliado e deixado como evolução
futura, para manter o escopo desta entrega focado no ciclo relatório → RAG →
resposta.

## ✅ Requisitos desta entrega

| Requisito | Onde está |
|---|---|
| Dashboard com cards de risco e resumo de ancestralidade | `app/src/screens/DashboardScreen.js`, `HomeScreen.js` (Riscos) |
| Navegação clara entre seções do perfil genético | abas Dashboard / Riscos / Ancestralidade / Análise (`app/App.js`) |
| Personalização das respostas via RAG | `app/backend/rag_system.py` (`Retriever`, indexação por usuário) |
| Simplificação de linguagem (NLP) | regra 4 do `SYSTEM_PROMPT_RAG` (`app/backend/prompts.py`) — instrui linguagem acessível/sem jargão; `TextCleaner` normaliza siglas genômicas |
| Sistema RAG (busca vetorial + geração fundamentada) | `app/backend/rag_system.py` — detalhado em `docs/ARQUITETURA_IA.md` |
| Resumos automáticos do relatório | `app/src/services/resumoService.js` — nota de escopo acima |
| Comunicação responsável / disclaimers obrigatórios | disclaimer anexado por código em toda resposta (`prompts.py` + `rag_system.py`) — detalhes em `docs/GOVERNANCA_E_RISCOS.md` |
| Multimodalidade (opcional) | avaliada e deixada fora do escopo — ver nota acima |
| Persistência de dados e histórico de interações | `app/src/db/database.js` (SQLite local) |
| Documentação da arquitetura de IA | `docs/ARQUITETURA_IA.md` |
| Front-end simples e funcional | `app/` — telas Ancestralidade (envio do relatório) e Análise (chat) |
| Relatório de governança e riscos | `docs/GOVERNANCA_E_RISCOS.md` |
| Apresentação em vídeo | link no topo deste README |
| README atualizado | este arquivo |

## ▶️ COMO RODAR

O projeto tem **duas partes que rodam ao mesmo tempo, em terminais
separados**: o backend (Python) e o app (Expo). Precisa dos dois no ar pro
chat/resumos funcionarem de verdade.

### 1. Backend (API RAG)

```bash
cd app/backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# edite o .env e preencha UMA chave de LLM:
#   GEMINI_API_KEY   -> grátis, sem cartão: https://aistudio.google.com/apikey
#   ANTHROPIC_API_KEY ou OPENAI_API_KEY -> pagos, créditos pré-pagos

python api.py
```

A API sobe em `http://localhost:5000`. Deixe esse terminal aberto.

### 2. App (Expo)

Em outro terminal:

```bash
cd app
npm install
npx expo start --web
```

Isso abre o app no navegador (o terminal mostra o link, geralmente
`http://localhost:8081`). Também dá pra rodar em Android/iOS apertando `a`
ou `i` no terminal do Expo (precisa de emulador configurado).

### 3. Testar o fluxo completo

1. Abra a aba **Ancestralidade**.
2. Clique em **"Usar exemplo"** (preenche o formulário com dados de
   demonstração) ou preencha os campos manualmente.
3. Clique em **"Enviar relatório"** — o app indexa o relatório no backend,
   salva localmente, gera um resumo real com o modelo de IA e te leva direto
   pra aba **Análise → Chat** com a resposta.
4. Continue a conversa digitando novas perguntas no chat.
5. Confira as abas **Riscos** e **Dashboard** — os cards refletem os dados
   do relatório que você acabou de enviar.
6. Na aba **Análise**, cada resumo pode ser excluído (com a conversa
   associada) pelo ícone de lixeira no card.

Se o backend não estiver rodando, faltar chave de API ou a cota gratuita do
LLM esgotar, o app mostra um aviso explicando o problema (a indexação
funciona sem chave; só a geração da resposta do modelo precisa dela).

Mais detalhes do backend (endpoints, variáveis de ambiente, teste via curl):
veja `app/backend/README.md`.

## 📋 Licença

<img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1"><p xmlns:cc="http://creativecommons.org/ns#" xmlns:dct="http://purl.org/dc/terms/"><a property="dct:title" rel="cc:attributionURL" href="https://github.com/agodoi/template">MODELO GIT FIAP</a> por <a rel="cc:attributionURL dct:creator" property="cc:attributionName" href="https://fiap.com.br">Fiap</a> está licenciado sobre <a href="http://creativecommons.org/licenses/by/4.0/?ref=chooser-v1" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">Attribution 4.0 International</a>.</p>

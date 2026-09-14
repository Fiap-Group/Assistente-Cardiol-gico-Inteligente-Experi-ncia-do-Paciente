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
### Tutor
CaiqueFiap-2026

## 📜 Descrição

App (React Native/Expo) + backend (Python/Flask + RAG) para o desafio
Dasa/Genera: dashboard com cards de risco genético e resumo de
ancestralidade, navegação clara entre as seções do perfil genético, chat com
um agente de IA (RAG) sobre o próprio relatório enviado pelo usuário, geração
automática de resumos a cada novo relatório e persistência local de dados e
histórico de interações.

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

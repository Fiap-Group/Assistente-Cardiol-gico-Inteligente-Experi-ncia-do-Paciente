# FIAP - Faculdade de Informática e Administração Paulista

# Assistente Cardiológico

App (React Native/Expo) + backend (Python/Flask) que integra um assistente
conversacional criado no **IBM Watson Assistant** para tirar dúvidas gerais
de pacientes sobre saúde cardiovascular.

## 📜 Descrição

O app tem duas telas: um **Dashboard** com boas-vindas, disclaimer de uso e
dicas rápidas de saúde do coração, e um **Chat** contínuo com o assistente.
O backend Flask não tem nenhuma inteligência própria — ele só repassa a
mensagem do usuário para o Watson Assistant (configurado separadamente no
IBM Cloud) via API oficial, e devolve a resposta pro app. O histórico da
conversa fica salvo localmente no dispositivo (SQLite).

## 🏗️ Arquitetura

```
App (Expo, React Native)
   │  POST /api/chat  { sessao_id, mensagem }
   ▼
Backend Flask (app/backend/api.py)
   │  cria/reaproveita uma sessão do Watson por conversa
   ▼
IBM Watson Assistant (IBM Cloud)
   │  responde com base no assistant publicado lá
   ▼
Backend devolve { resposta } → App salva no SQLite local e exibe no chat
```

Sem credenciais do Watson configuradas, o backend sobe automaticamente em
**modo simulado (mock)** — devolve uma resposta fixa avisando que faltam as
credenciais — o que permite testar todo o fluxo do app antes de ter a
instância do Watson Assistant pronta.

## 📁 Estrutura do projeto

```
docs/
  ARQUITETURA_IA.md             # Arquitetura da integração com Watson Assistant
  GOVERNANCA_E_RISCOS.md         # Limites do assistente, disclaimers, riscos

app/                            # App React Native/Expo (frontend)
  src/
    screens/                     # DashboardScreen, ChatScreen
    components/                   # ChatBox, Disclaimer, LoadingSpinner
    db/                            # Persistência local (SQLite)
    services/                       # Cliente da API do backend (api.js)
    theme/, styles/                  # Paleta de cores e estilos

  backend/                       # Backend Flask
    api.py                        # Endpoints /api/health e /api/chat
    watson_client.py               # Integração com o Watson Assistant (SDK oficial + modo mock)
    requirements.txt
    Dockerfile, docker-compose.yml  # Opção de execução via Docker
    test_api.py                     # Testes automatizados (rodam em modo mock)
    README.md                       # Documentação específica do backend
```

## ▶️ COMO RODAR

O projeto tem **duas partes que rodam ao mesmo tempo, em terminais
separados**: o backend (Python) e o app (Expo).

### 1. Backend (Flask + Watson Assistant)

**Opção A — venv manual (recomendada, mais simples):**

```bash
cd app/backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# preencha WATSON_API_KEY, WATSON_URL e WATSON_ASSISTANT_ID com as
# credenciais da sua instância do Watson Assistant no IBM Cloud. Sem
# preencher, a API sobe normalmente em modo simulado (mock).

python api.py
```

**Opção B — Docker (alternativa, não exige Python instalado):**

```bash
cd app/backend
cp .env.example .env   # preencher credenciais do Watson (ou deixar em branco p/ modo mock)
docker compose up --build
```

Ambas as opções sobem a API em `http://localhost:5000`. Deixe o terminal
aberto.

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

### 3. Testar o fluxo

1. Abra o app — a tela **Dashboard** mostra o disclaimer e as dicas de
   saúde cardiovascular.
2. Clique em **"Conversar com o assistente"** (ou vá direto na aba **Chat**).
3. Digite uma pergunta e envie. Se o backend estiver em modo mock, a
   resposta vem simulada, avisando que faltam as credenciais do Watson; com
   as credenciais reais preenchidas, a resposta vem do assistant publicado
   no IBM Cloud.
4. Feche e reabra o app: o histórico da conversa continua lá (SQLite local).

### 4. Perguntas de exemplo para testar o chat

O assistant publicado no Watson Assistant já tem 3 fluxos de conversa
configurados. Perguntas fora desses temas caem no fallback padrão ("Eu não
entendi. Você pode tentar reformular a frase.").

**Sintomas de pressão alta** (resposta direta, sem perguntas de
acompanhamento):

- "Pressão alta dá dor de cabeça?"
- "Pressão alta dá dor de barriga?"
- "Quais os sinais de hipertensão?"
- "Quais são os sintomas de pressão alta?"

**Localização de UBS / posto de saúde** (fluxo de 2 passos — o assistant
pergunta o bairro antes de responder):

- "Como encontro a UBS mais próxima de mim?"
- "Onde fica a UBS mais próxima do meu bairro?"
- "Onde tem uma unidade básica de saúde no meu bairro?"
- "Qual é o posto de saúde mais perto da minha casa?"
- "Qual o endereço do posto de saúde mais próximo?"
- → o assistant responde **"qual Bairro?"**; digite um bairro (ex.:
  `pinheiros`) na mensagem seguinte, na mesma conversa, para receber o
  endereço e horário de funcionamento de uma UBS.

**Como aferir a pressão corretamente** (passo a passo com o medidor
digital):

- "Como eu verifico minha pressão?"
- "Como saber se estou com a pressão alta?"
- "Como usar o medidor de pressão digital corretamente?"
- "Onde devo colocar o aparelho para medir a pressão?"
- "Qual o passo a passo para aferir a pressão no braço?"

### 5. Testes automatizados do backend

```bash
cd app/backend
pip install pytest
pytest test_api.py
```

Os testes rodam sempre em modo mock, sem precisar de credenciais reais.

## 📋 Licença

<img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1"><p xmlns:cc="http://creativecommons.org/ns#" xmlns:dct="http://purl.org/dc/terms/"><a property="dct:title" rel="cc:attributionURL" href="https://github.com/agodoi/template">MODELO GIT FIAP</a> por <a rel="cc:attributionURL dct:creator" property="cc:attributionName" href="https://fiap.com.br">Fiap</a> está licenciado sobre <a href="http://creativecommons.org/licenses/by/4.0/?ref=chooser-v1" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">Attribution 4.0 International</a>.</p>

# Governança e Riscos — Assistente Cardiológico

Documento sobre os limites conhecidos do assistente, os disclaimers
aplicados e a política de privacidade das mensagens trocadas com o usuário.

## Limites do assistente

- **Não é diagnóstico médico.** O assistente responde dúvidas gerais sobre
  saúde cardiovascular com base no que foi configurado no Watson Assistant
  (Actions/diálogo publicados no IBM Cloud). Ele não analisa exames, não
  avalia o caso individual do usuário e não substitui uma consulta médica.
- **Escopo limitado ao que foi publicado no Watson Assistant.** Se o
  assistant não tiver uma ação configurada para o que o usuário perguntou,
  a resposta de fallback deve deixar isso claro, em vez de inventar uma
  resposta — isso é responsabilidade da configuração do assistant no IBM
  Cloud, não do backend Flask (que só repassa mensagens).
- **Disponibilidade depende de terceiro (IBM Cloud).** Se o Watson
  Assistant estiver fora do ar, com credenciais inválidas, ou com a cota do
  plano Lite esgotada, o backend devolve um erro claro (`502`) explicado ao
  usuário no chat — nunca falha silenciosamente. O modo simulado (mock)
  permite que o restante do app continue testável mesmo nessa situação.
- **Sem verificação de identidade.** Qualquer pessoa com acesso ao
  dispositivo/app pode conversar com o assistente — não há autenticação de
  usuário nesta versão (adequado para um MVP de curso).

## Disclaimers aplicados

- Disclaimer fixo na tela **Dashboard**, visível antes de qualquer
  interação: o assistente não substitui uma consulta médica, e em caso de
  sintomas graves (dor no peito, falta de ar intensa) o usuário deve
  procurar atendimento de emergência imediatamente.
- **Recomendação de configuração do Watson Assistant**: o assistant
  publicado no IBM Cloud deve ter uma ação/intent dedicada para reconhecer
  menções a sintomas de emergência e responder com uma orientação clara
  (ex.: "procure o pronto-socorro mais próximo ou ligue para o SAMU (192)")
  em vez de tentar responder à dúvida normalmente — essa é uma
  responsabilidade de configuração do assistant em si, fora do escopo do
  código deste repositório, mas registrada aqui como requisito de
  governança da solução como um todo.
- Mensagens de erro do app (backend fora do ar, credenciais do Watson não
  configuradas) são sempre explicadas ao usuário, para que ele não confunda
  indisponibilidade técnica com "não há necessidade de atenção médica".

## Privacidade das mensagens

**O que é armazenado, e onde:**

- O histórico de mensagens da conversa fica salvo **somente no dispositivo
  do usuário**, em SQLite local (`app/src/db/database.js`, via
  `expo-sqlite`). Não existe banco de dados remoto próprio do projeto.

**O que sai do dispositivo, e para onde:**

- Cada mensagem enviada no chat trafega até o **backend Flask local**
  (`app/backend/api.py`) e, em seguida, até a **API do Watson Assistant**
  no IBM Cloud — esse é o único terceiro que recebe o conteúdo das
  mensagens do usuário.
  - O uso do Watson Assistant é regido pela política de privacidade e
    termos da própria IBM; este projeto não tem controle sobre como esses
    dados são retidos ou processados do lado deles.
  - Nenhum dado é enviado para nenhum outro terceiro além do Watson
    Assistant.

**Recomendações para uma versão em produção (fora do escopo deste MVP):**

- Evitar que o usuário digite dados de identificação pessoal ou de saúde
  sensíveis no chat livre; se for necessário coletar algo assim, fazer via
  campos estruturados com consentimento explícito, não texto livre.
- Avaliar as garantias contratuais de retenção/uso de dados do plano do
  IBM Cloud contratado (Lite vs. planos pagos) antes de um uso real com
  pacientes.
- Autenticação de usuário e controle de acesso ao dispositivo/app.
- Base legal e consentimento explícito do titular antes do uso, alinhado à
  LGPD (dado de saúde é dado sensível, Art. 11), caso o assistant venha a
  lidar com informações de saúde mais específicas no futuro.

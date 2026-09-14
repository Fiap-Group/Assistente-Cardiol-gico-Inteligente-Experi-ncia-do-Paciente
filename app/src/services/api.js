import { Platform } from 'react-native';

// Emulador Android não enxerga "localhost" da máquina host, por isso usa
// o alias especial 10.0.2.2 nesse caso.
const API_URL = Platform.select({
  android: 'http://10.0.2.2:5000',
  default: 'http://localhost:5000',
});

// Envia uma mensagem do usuário ao backend (que repassa ao Watson Assistant)
// e retorna a resposta em texto. Lança erro se o backend não estiver
// rodando ou se o Watson Assistant devolver falha.
export async function enviarMensagem(sessaoId, texto) {
  const resposta = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessao_id: sessaoId, mensagem: texto }),
  });

  if (!resposta.ok) {
    const erro = await resposta.json().catch(() => ({}));
    throw new Error(erro.details || erro.error || 'Falha ao consultar o assistente.');
  }

  return resposta.json(); // { resposta: '...' }
}

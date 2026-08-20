import { useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme/colors';
import { buscarMensagens, salvarMensagem } from '../db/database';
import { perguntarAoAgente } from '../services/api';
import styles from '../styles/chatBoxStyles';

export default function ChatBox({ sessaoId }) {
  const [mensagens, setMensagens] = useState([]);
  const [texto, setTexto] = useState('');
  const listaRef = useRef(null);

  // Carrega o histórico da sessão recebida (a primeira mensagem já é o resumo, salvo pelo criarResumo)
  useEffect(() => {
    if (!sessaoId) return;

    (async () => {
      const historico = await buscarMensagens(sessaoId);
      setMensagens(historico.map((item) => ({ id: String(item.id), autor: item.autor, texto: item.texto })));
    })();
  }, [sessaoId]);

  const handleEnviar = async () => {
    const mensagemDigitada = texto.trim();
    if (!mensagemDigitada || !sessaoId) return;

    const mensagemUsuario = { id: Date.now().toString(), autor: 'usuario', texto: mensagemDigitada };
    setMensagens((atual) => [...atual, mensagemUsuario]);
    setTexto('');
    await salvarMensagem(sessaoId, 'usuario', mensagemDigitada);

    try {
      const resultado = await perguntarAoAgente(mensagemDigitada);
      const respostaIA = { id: (Date.now() + 1).toString(), autor: 'ia', texto: resultado.answer };
      setMensagens((atual) => [...atual, respostaIA]);
      await salvarMensagem(sessaoId, 'ia', resultado.answer);
    } catch (erro) {
      const textoErro =
        'Não consegui falar com o agente agora. Verifique se o backend está rodando (python backend/api.py) ' +
        `e se a chave de API foi configurada. Detalhe: ${erro.message}`;
      const respostaErro = { id: (Date.now() + 1).toString(), autor: 'ia', texto: textoErro };
      setMensagens((atual) => [...atual, respostaErro]);
      await salvarMensagem(sessaoId, 'ia', textoErro);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={listaRef}
        data={mensagens}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        onContentSizeChange={() => listaRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => (
          <View style={[styles.bolha, item.autor === 'usuario' ? styles.bolhaUsuario : styles.bolhaIA]}>
            <Text style={item.autor === 'usuario' ? styles.textoUsuario : styles.textoIA}>{item.texto}</Text>
          </View>
        )}
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={texto}
          onChangeText={setTexto}
          placeholder="Digite sua pergunta..."
          placeholderTextColor={colors.textMuted}
          multiline
        />
        <TouchableOpacity
          style={[styles.enviarBotao, !texto.trim() && styles.enviarBotaoDesabilitado]}
          onPress={handleEnviar}
          disabled={!texto.trim()}
        >
          <Text style={styles.enviarTexto}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

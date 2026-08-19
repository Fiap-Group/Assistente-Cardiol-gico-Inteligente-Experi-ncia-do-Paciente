import { useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme/colors';
import styles from '../styles/chatBoxStyles';

export default function ChatBox() {
  const [mensagens, setMensagens] = useState([
    { id: '1', autor: 'ia', texto: 'Olá! Em breve vou poder analisar suas medições e tirar dúvidas sobre sua saúde por aqui.' },
  ]);
  const [texto, setTexto] = useState('');
  const listaRef = useRef(null);

  const handleEnviar = () => {
    const mensagemDigitada = texto.trim();
    if (!mensagemDigitada) return;

    const mensagemUsuario = { id: Date.now().toString(), autor: 'usuario', texto: mensagemDigitada };
    setMensagens((atual) => [...atual, mensagemUsuario]);
    setTexto('');

    // TODO: trocar por uma chamada real ao modelo de IA quando ele estiver pronto
    setTimeout(() => {
      const respostaIA = {
        id: (Date.now() + 1).toString(),
        autor: 'ia',
        texto: 'Ainda não tenho um modelo conectado, mas em breve vou responder de verdade por aqui!',
      };
      setMensagens((atual) => [...atual, respostaIA]);
    }, 600);
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

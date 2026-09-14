import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Disclaimer from '../components/Disclaimer';
import styles from '../styles/dashboardScreenStyles';

const DICAS = [
  'Pratique pelo menos 150 minutos de atividade física moderada por semana.',
  'Reduza o consumo de sal e alimentos ultraprocessados.',
  'Monitore sua pressão arterial regularmente.',
  'Não fume e evite o consumo excessivo de álcool.',
  'Durma de 7 a 8 horas por noite.',
];

export default function DashboardScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.saudacao}>Olá!</Text>
        <Text style={styles.subtitulo}>
          Sou o Assistente Cardiológico. Posso tirar dúvidas gerais sobre saúde do coração.
        </Text>

        <Disclaimer texto="Este assistente não substitui uma consulta médica. Em caso de dor no peito, falta de ar intensa ou outros sintomas graves, procure atendimento de emergência imediatamente." />

        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Dicas rápidas</Text>
          {DICAS.map((dica) => (
            <Text key={dica} style={styles.descricaoSecao}>
              • {dica}
            </Text>
          ))}
        </View>

        <TouchableOpacity style={styles.botaoChat} onPress={() => navigation.navigate('Chat')}>
          <Text style={styles.botaoChatTexto}>Conversar com o assistente</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

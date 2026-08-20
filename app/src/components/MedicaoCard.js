import { View, Text } from 'react-native';
import { colors } from '../theme/colors';
import styles from '../styles/medicaoCardStyles';

export default function MedicaoCard({ sistolica, diastolica, data, hora }) {
  // Função para classificar a pressão
  const getClassificacao = () => {
    if (sistolica < 120 && diastolica < 80) return { texto: 'Normal', ...colors.status.good };
    if (sistolica < 130 && diastolica < 85) return { texto: 'Normal Alta', ...colors.status.warning };
    if (sistolica < 140 || diastolica < 90) return { texto: 'Hipertensão Leve', ...colors.status.serious };
    return { texto: 'Hipertensão', ...colors.status.critical };
  };

  const classificacao = getClassificacao();

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.data}>{data}</Text>
        <Text style={styles.hora}>{hora}</Text>
      </View>

      <View style={styles.pressaoContainer}>
        <Text style={styles.pressaoLabel}>Pressão Arterial</Text>
        <Text style={styles.pressaoValor}>
          {sistolica} <Text style={styles.separador}>x</Text> {diastolica}
          <Text style={styles.unidade}> mmHg</Text>
        </Text>
      </View>

      <View style={[styles.badge, { backgroundColor: classificacao.bg }]}>
        <Text style={[styles.badgeText, { color: classificacao.text }]}>{classificacao.texto}</Text>
      </View>
    </View>
  );
}

import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles from '../styles/formularioMedicaoStyles';

export default function FormularioMedicao({ onAddMedicao }) {
  const [sistolica, setSistolica] = useState('');
  const [diastolica, setDiastolica] = useState('');

  const handleSubmit = () => {
    if (!sistolica || !diastolica) return;

    const agora = new Date();
    const medicao = {
      id: Date.now(),
      sistolica: parseInt(sistolica),
      diastolica: parseInt(diastolica),
      data: agora.toLocaleDateString('pt-BR'),
      hora: agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    onAddMedicao(medicao);
    setSistolica('');
    setDiastolica('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nova Medição</Text>

      <View style={styles.inputRow}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Sistólica (máx)</Text>
          <TextInput
            style={styles.input}
            value={sistolica}
            onChangeText={setSistolica}
            placeholder="120"
            keyboardType="numeric"
            maxLength={3}
          />
        </View>

        <Text style={styles.separator}>x</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Diastólica (mín)</Text>
          <TextInput
            style={styles.input}
            value={diastolica}
            onChangeText={setDiastolica}
            placeholder="80"
            keyboardType="numeric"
            maxLength={3}
          />
        </View>
      </View>

      <Text style={styles.hint}>Exemplo: 120 x 80 mmHg</Text>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Registrar Medição</Text>
      </TouchableOpacity>
    </View>
  );
}

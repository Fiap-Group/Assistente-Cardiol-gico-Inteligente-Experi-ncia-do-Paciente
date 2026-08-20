import { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import Dropdown from './Dropdown';
import styles from '../styles/formularioIMCStyles';

const OPCOES_ATIVIDADE = [
  { label: 'Leve', value: 'leve' },
  { label: 'Moderado', value: 'moderado' },
  { label: 'Intenso', value: 'intenso' },
];

export default function FormularioIMC({ onChange }) {
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [atividadeFisica, setAtividadeFisica] = useState('leve');

  const handleChange = (campo, valor) => {
    const dados = { peso, altura, atividadeFisica, [campo]: valor };
    if (campo === 'peso') setPeso(valor);
    if (campo === 'altura') setAltura(valor);
    if (campo === 'atividadeFisica') setAtividadeFisica(valor);
    onChange && onChange(dados);
  };

  const pesoNum = parseFloat(peso.replace(',', '.'));
  const alturaNum = parseFloat(altura.replace(',', '.')) / 100;
  const imc = pesoNum > 0 && alturaNum > 0 ? pesoNum / (alturaNum * alturaNum) : null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>IMC e Atividade Física</Text>

      <View style={styles.inputRow}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Peso (kg)</Text>
          <TextInput
            style={styles.input}
            value={peso}
            onChangeText={(valor) => handleChange('peso', valor)}
            placeholder="70"
            keyboardType="numeric"
            maxLength={5}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Altura (cm)</Text>
          <TextInput
            style={styles.input}
            value={altura}
            onChangeText={(valor) => handleChange('altura', valor)}
            placeholder="170"
            keyboardType="numeric"
            maxLength={3}
          />
        </View>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Atividade Física</Text>
        <Dropdown
          options={OPCOES_ATIVIDADE}
          selectedValue={atividadeFisica}
          onValueChange={(valor) => handleChange('atividadeFisica', valor)}
        />
      </View>

      {imc && (
        <View style={styles.resultado}>
          <Text style={styles.resultadoLabel}>Seu IMC</Text>
          <Text style={styles.resultadoValor}>{imc.toFixed(1)}</Text>
        </View>
      )}
    </View>
  );
}

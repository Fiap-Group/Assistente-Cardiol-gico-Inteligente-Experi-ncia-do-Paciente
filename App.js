import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.texto}>FIAP</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#630e08',
    alignItems: 'center',
    justifyContent: 'center',
  },
  texto: {
    color: '#ffffff',
    fontSize: 40,
    fontWeight:'bold',
  }
});

import { View, Text, ScrollView } from 'react-native';
import { useState } from 'react';
import ErrorMessage from '../components/ErrorMessage';
import FormularioMedicao from '../components/FormularioMedicao';
import ImageUploadCard from '../components/ImageUploadCard';
import FormularioIMC from '../components/FormularioIMC';
import styles from '../styles/profileScreenStyles';

export default function ProfileScreen() {
   const [erro, setErro] = useState(null);

   const handleAddMedicao = (medicao) => {
      console.log('Tentando salvar medição:', medicao);

      // Simulando um delay para dar sensação de processamento
      setTimeout(() => {
         // Simulando erro ao tentar salvar (será implementado posteriormente)
         setErro('Não foi possível salvar a medição. Verifique sua conexão com o servidor.');
      }, 500);
   };

   const handleRetry = () => {
      console.log('Limpando mensagem de erro...');
      setErro(null);
   };

   return (
      <ScrollView style={styles.container}>
         <View style={styles.content}>
            <Text style={styles.sectionTitle}>Registro de Medições</Text>

            {/* Exibe o erro se houver */}
            {erro ? (
               <View style={styles.section}>
                  <ErrorMessage
                     message={erro}
                     onRetry={handleRetry}
                     icon="Atenção"
                  />
               </View>
            ) : (
               /* Formulário de registro */
               <View style={styles.section}>
                  <FormularioMedicao onAddMedicao={handleAddMedicao} />
               </View>
            )}

            <Text style={styles.sectionTitle}>Exames e Imagens</Text>

            <View style={styles.section}>
               <ImageUploadCard label="Foto do ECG" />
            </View>

            <Text style={styles.sectionTitle}>Dados Corporais</Text>

            <View style={styles.section}>
               <FormularioIMC />
            </View>
         </View>
      </ScrollView>
   );
}

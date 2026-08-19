import { View, Text, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import MedicaoCard from '../components/MedicaoCard';
import LoadingSpinner from '../components/LoadingSpinner';
import styles from '../styles/homeScreenStyles';

export default function HomeScreen() {
   const [carregando, setCarregando] = useState(true);
   const [medicoes, setMedicoes] = useState([]);

   // Simula o carregamento de dados de uma API
   useEffect(() => {
      // Simulando chamada de API com delay de 2 segundos
      setTimeout(() => {
         const medicoesExemplo = [
            { id: 1, sistolica: 120, diastolica: 80, data: '02/12/2025', hora: '08:30' },
            { id: 2, sistolica: 135, diastolica: 88, data: '01/12/2025', hora: '14:15' },
            { id: 3, sistolica: 118, diastolica: 75, data: '30/11/2025', hora: '09:00' },
         ];

         setMedicoes(medicoesExemplo);
         setCarregando(false);
      }, 2000);
   }, []);

   // Exibe o loading enquanto carrega os dados
   if (carregando) {
      return <LoadingSpinner message="Carregando suas medições..." />;
   }

   return (
      <ScrollView style={styles.container}>
         <View style={styles.content}>
            <Text style={styles.header}>Minhas Medições</Text>

            {/* Lista de medições carregadas */}
            {medicoes.map(medicao => (
               <MedicaoCard
                  key={medicao.id}
                  sistolica={medicao.sistolica}
                  diastolica={medicao.diastolica}
                  data={medicao.data}
                  hora={medicao.hora}
               />
            ))}
         </View>
      </ScrollView>
   );
}

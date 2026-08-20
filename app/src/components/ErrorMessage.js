import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles/errorMessageStyles';

export default function ErrorMessage({ message, onRetry, icon = '' }) {
   return (
      <View style={styles.container}>
         <Text style={styles.icon}>{icon}</Text>
         <Text style={styles.title}>Ops! Algo deu errado</Text>
         <Text style={styles.message}>{message}</Text>

         {onRetry && (
            <TouchableOpacity style={styles.button} onPress={onRetry}>
               <Text style={styles.buttonText}>Tentar Novamente</Text>
            </TouchableOpacity>
         )}
      </View>
   );
}

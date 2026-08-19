import { View, Text } from 'react-native';
import ChatBox from '../components/ChatBox';
import styles from '../styles/analiseScreenStyles';

export default function AnaliseScreen() {
   return (
      <View style={styles.container}>
         <View style={styles.header}>
            <Text style={styles.title}>Análise</Text>
         </View>
         <ChatBox />
      </View>
   );
}

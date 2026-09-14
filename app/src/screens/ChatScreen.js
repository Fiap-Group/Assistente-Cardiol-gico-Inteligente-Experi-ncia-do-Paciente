import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import ChatBox from '../components/ChatBox';
import { obterSessaoAtual } from '../db/database';
import { colors } from '../theme/colors';
import styles from '../styles/chatScreenStyles';

export default function ChatScreen() {
  const [sessaoId, setSessaoId] = useState(null);

  useEffect(() => {
    obterSessaoAtual().then(setSessaoId);
  }, []);

  if (!sessaoId) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ChatBox sessaoId={sessaoId} />
    </View>
  );
}

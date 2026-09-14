import { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  useFonts,
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';
import { colors } from './src/theme/colors';
import { fonts } from './src/theme/typography';
import styles from './src/styles/appStyles';
import LoadingSpinner from './src/components/LoadingSpinner';
import { initDatabase } from './src/db/database';

// Importar as telas
import DashboardScreen from './src/screens/DashboardScreen';
import ChatScreen from './src/screens/ChatScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });
  const [dbPronto, setDbPronto] = useState(false);

  useEffect(() => {
    initDatabase().then(() => setDbPronto(true));
  }, []);

  if (!fontsLoaded || !dbPronto) {
    return <LoadingSpinner message="Carregando..." />;
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: styles.tabBar,
          tabBarShowLabel: false,
          headerStyle: styles.header,
          headerTintColor: colors.white,
          headerTitleStyle: styles.headerTitle,
        }}
      >
        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size / 2, color, fontFamily: fonts.bold }}>INÍCIO</Text>
            ),
          }}
        />

        <Tab.Screen
          name="Chat"
          component={ChatScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size / 2, color, fontFamily: fonts.bold }}>CHAT</Text>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

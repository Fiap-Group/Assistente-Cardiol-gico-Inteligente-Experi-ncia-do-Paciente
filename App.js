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

// Importar as telas
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AnaliseScreen from './src/screens/AnaliseScreen';
const Tab = createBottomTabNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  if (!fontsLoaded) {
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
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size / 2, color, fontFamily: fonts.bold }}>HOME</Text>
            ),
          }}
        />

        <Tab.Screen
          name="Perfil"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size / 2, color, fontFamily: fonts.bold }}>PERFIL</Text>
            ),
          }}
        />

         <Tab.Screen
          name="Análise"
          component={AnaliseScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size / 2, color, fontFamily: fonts.bold }}>ANÁLISE</Text>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
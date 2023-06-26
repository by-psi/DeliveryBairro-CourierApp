/**
 * DeliveryBairro CourierApp - App.js
*/

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Amplify, I18n } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react-native';
import { translations } from '@aws-amplify/ui';

import logo from './assets/logo.png';
import marca from './assets/marca.png';
import Navigation from "./src/navigation";
import config from './src/aws-exports';

import AuthContextProvider from './src/contexts/AuthContext';
import OrderContextProvider from './src/contexts/OrderContext';

import { LogBox } from "react-native";
LogBox.ignoreLogs(["Setting a timer"]);

Amplify.configure({
  ...config, 
  Analytics: {
    disabled: true
  },
});

export default function App() {
  return (
    <NavigationContainer>
      <Authenticator.Provider>
        <Authenticator  Header={AppHeader}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <AuthContextProvider>
              <OrderContextProvider>
                <StatusBar style="dark" backgroundColor="#FFF" />
                <Navigation />
              </OrderContextProvider>
            </AuthContextProvider>
          </GestureHandlerRootView>
        </Authenticator>
      </Authenticator.Provider>
    </NavigationContainer>
  );
}

I18n.putVocabularies(translations);
I18n.setLanguage('pt');
I18n.putVocabulariesForLanguage('pt', {
  Username: 'Usuário', 
  Password: 'Senha', 
  Email: 'E-mail', 
  Code: 'Código de Verificação', 
  Confirm: 'Confirmação (Código de Verificação)',
  'Sign In': 'LOGIN DE USUÁRIO',
  'Sign in': 'ACESSAR',
  'Sign in to your account': 'Seja bemvindo(a)!',
  'Forgot your password?': 'Esqueseu sua Senha?',
  'Create Account': 'REGISTRAR-SE', 
  'Create a new account': 'Novo Usuário',
  'Confirm Password': 'Confirme sua senha',
  'Phone Number': 'Digite seu número de telefone',
  'Back to Sign In': 'Retorna para Login',
  'Forgot Password?': 'Lembrar senha?',
  'Enter your Email': 'Digite seu email',
  'Enter your Password': 'Digite sua senha',
  'Please confirm your Password': 'Digite novamente sua senha',
  'User does not exist': 'Usuário não existe'
});

function AppHeader() {
  return (
    <View style={styles.container}>
      <Image source={ logo } style={styles.logo} resizeMode="contain" />
      <Image source={ marca } style={styles.marca} resizeMode="contain" />
      <Text>UserApp</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center", 
    justifyContent: "center"
  },
  logo: {
    width: 85, 
    height: 85
  },
  marca: {
    width: 195, 
    height: 85
  },
});

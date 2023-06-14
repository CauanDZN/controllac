import React, {useEffect, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ThemeProvider} from 'styled-components';
import {StatusBar} from 'react-native';
import auth, {firebase, FirebaseAuthTypes} from '@react-native-firebase/auth';
import {firebaseConfig} from './src/utils/firebaseconfig';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';

import theme from './src/global/styles/theme';
import {Routes} from './src/routes';

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  useEffect(() => {
    const fetchUserStorage = async () => {
      const storedUser = await AsyncStorage.getItem('token');
      if (storedUser !== null) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
      setInitializing(false);
    };

    fetchUserStorage();
  }, []);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async _user => {
      if (_user) {
        // Aqui você pode fazer a validação do token ou qualquer outra lógica de autenticação
        const tokenValid = await validateToken(_user.token); // Substitua com a sua lógica de validação do token
        if (tokenValid) {
          setUser(_user);
        } else {
          setUser(null);
          await AsyncStorage.removeItem('token');
        }
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  const validateToken = async (token: string) => {
    // Implemente a lógica de validação do token aqui
    // Retorne true se o token for válido e false caso contrário
    return true;
  };

  if (initializing) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator color="#000" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <ThemeProvider theme={theme}>
        <StatusBar barStyle="light-content" backgroundColor="#320059" />
        <Routes />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

export default App;

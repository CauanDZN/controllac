import React, {useEffect, useState} from 'react';
import auth, {firebase, FirebaseAuthTypes} from '@react-native-firebase/auth';
import 'react-native-gesture-handler';
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';

import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins'

import { ThemeProvider } from 'styled-components';
import theme from './src/global/styles/theme';
import { StatusBar } from 'react-native';
import {ActivityIndicator, SafeAreaView, View} from 'react-native';

import {SignInScreen} from './src/screens/SignIn';
import { Routes } from './src/routes';

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  const firebaseConfig = {
    apiKey: "AIzaSyBOFqudYn9qbvSmz66RufixoSMcQXQveHg",
    authDomain: "437059309354-1q7vja959c1b1bl1cmbrtik7jmghq6ve.apps.googleusercontent.com",
    databaseURL: "",
    projectId: "controllac",
    storageBucket: "controllac.appspot.com",
    messagingSenderId: "",
    appId: "437059309354",
    measurementId: ""
  };

  if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig)
  } 

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(_user => {
      if (initializing) {
        setInitializing(false);
      }
      setUser(_user);
    });

    return unsubscribe;
  }, [initializing]);

  if (initializing) {
    return (
      <View>
        <ActivityIndicator color="#000" />
      </View>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <StatusBar barStyle="light-content" backgroundColor="#320059"></StatusBar>
      {
        user ? 
          <Routes /> 
        : 
          <SignInScreen />
      } 
    </ThemeProvider>
  );
};

export default App;

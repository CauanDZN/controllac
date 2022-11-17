import React, {useEffect, useState} from 'react';
import auth, {firebase, FirebaseAuthTypes} from '@react-native-firebase/auth';
import 'react-native-gesture-handler';
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';

import { useFonts } from 'expo-font';

import { ThemeProvider } from 'styled-components';
import theme from './src/global/styles/theme';
import { StatusBar } from 'react-native';
import {ActivityIndicator, SafeAreaView, View} from 'react-native';

import { GoogleSignin } from '@react-native-google-signin/google-signin';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {SignInScreen} from './src/screens/SignIn';
import { Routes } from './src/routes';
import { MyButton } from './src/components/MyButton';

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [userStorageLoading, setUserStorageLoading] = useState(true);

  const userStorageKey = '@controllac:user';

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
          <>
            <SignInScreen />
          </>
          
      } 
    </ThemeProvider>
  );
};

export default App;

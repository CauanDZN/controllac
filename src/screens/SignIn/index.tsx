import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import {StyleSheet} from 'react-native';
import auth, { firebase } from '@react-native-firebase/auth';

import logo from '../../assets/logo.svg';

import { GoogleSignin } from '@react-native-google-signin/google-signin';

import {MyButton} from '../../components/MyButton';
import {MyTextInput} from '../../components/MyTextInput';
import {MyLink} from '../../components/MyLink';

export function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function signUp() {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        console.log('User account created & signed in!');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }

        console.error(error);
      });
  }

  function signIn() {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log('Usuário autenticado!');
      })
      .catch(error => {
        console.error(error);
      });
  }

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '437059309354-1q7vja959c1b1bl1cmbrtik7jmghq6ve.apps.googleusercontent.com', 
    });
  }, [])

  return (
    <View style={[styles.container, {justifyContent: 'center'}]}>
      
      <MyTextInput 
        placeholder="E-mail" 
        value={email} 
        onChangeText={setEmail} 
      />

      <MyTextInput
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <MyButton onPress={signIn} title="Entrar no App" />

      <MyButton onPress={() =>  {    
        GoogleSignin.configure({        
          webClientId: '437059309354-1q7vja959c1b1bl1cmbrtik7jmghq6ve.apps.googleusercontent.com',   
        });
        
        GoogleSignin.hasPlayServices().then((hasPlayService) => {
        if (hasPlayService) {
             GoogleSignin.signIn().then((userInfo) => {
                console.log(JSON.stringify(userInfo))             
              })
              .catch((e) => {            
                console.log("ERROR IS: " + JSON.stringify(e));             
                })        
              }}).catch((e) => {    
                console.log("ERROR IS: " + JSON.stringify(e));})}
                } title="Entrar com Google" />

      <MyLink title="Cadastrar e Entrar" onPress={signUp} />

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
});
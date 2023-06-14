import React, {useState} from 'react';
import {Text, View} from 'react-native';
import {StyleSheet} from 'react-native';
import auth, {firebase} from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

import logo from '../../assets/logo.png';

import {MyButton} from '../../components/MyButton';
import {MyTextInput} from '../../components/MyTextInput';
import {MyLink} from '../../components/MyLink';
import {Photo} from '../Dashboard/styles';

export function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function signInWithEmailAndPassword() {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(async () => {
        console.log('Usuário autenticado!');
        // Salvar o token no AsyncStorage
        const user = auth().currentUser;
        if (user && user.getIdToken) {
          const token = await user.getIdToken();
          await AsyncStorage.setItem('token', JSON.stringify(token)); // Converta o token para uma string JSON válida
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  function signUp() {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        console.log('Usuário criado e logado!');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('O e-mail já está em uso!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('O e-mail digitado é inválido!');
        }

        if (password.length < 6) {
          console.log('Não pode ter menos que 6 caracteres!');
        }

        console.error(error);
      });
  }

  return (
    <View style={[styles.container, {justifyContent: 'center'}]}>
      <Photo
        source={logo}
        style={{
          width: 200,
          height: 200,
        }}
      />

      <MyTextInput placeholder="E-mail" value={email} onChangeText={setEmail} />

      <MyTextInput
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <MyButton onPress={signInWithEmailAndPassword} title="Entrar no App" />

      <MyLink title="Cadastrar e Entrar" onPress={signUp} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#320059',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
});

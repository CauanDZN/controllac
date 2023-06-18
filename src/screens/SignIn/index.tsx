import React, {useEffect, useState} from 'react';
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';

import GoogleSvg from '../../assets/google.svg';
import LogoPng from '../../assets/logo.png';

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import {useDispatch} from 'react-redux';
import {SignInSocialButton} from '../../components/SignInSocialButton';
import {useAuth} from '../../hooks/auth';
import {Header} from '@react-navigation/stack';

export function SignIn() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const {signInWithGoogle} = useAuth();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '437059309354-1q7vja959c1b1bl1cmbrtik7jmghq6ve.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }, []);

  const loginWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      // Chame sua ação de login para enviar as informações de usuário para o backend
      dispatch(login(userInfo));
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('Login com o Google cancelado');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Login com o Google em andamento');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play Services não está disponível');
      } else {
        console.log(
          'Erro desconhecido ao fazer login com o Google:',
          error.message,
        );
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await GoogleSignin.signOut();
      await GoogleSignin.revokeAccess();
      setLoggedIn(false);
      setUserInfo({});
      console.log('Usuário desconectado');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleWrapper}>
          <Image source={LogoPng} style={styles.logo} />
          <Text style={styles.title}>
            Controle seus {'\n'}
            lotes de forma {'\n'}
            muito simples
          </Text>
        </View>
        <Text style={styles.signInTitle}>
          Faça seu login com {'\n'}
          uma das contas abaixo
        </Text>
      </View>
      <SafeAreaView>
        <ScrollView>
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <GoogleSigninButton
                style={{width: 192, height: 48}}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Light}
                onPress={loginWithGoogle}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: '100%',
    height: '70%',
    backgroundColor: '#E51C44',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  titleWrapper: {
    alignItems: 'center',
  },
  logo: {
    width: RFValue(120),
    height: RFValue(68),
  },
  title: {
    fontFamily: 'Roboto-Medium',
    color: '#FFF',
    fontSize: RFValue(30),
    textAlign: 'center',
    marginTop: 45,
  },
  signInTitle: {
    fontFamily: 'Roboto-Regular',
    color: '#FFF',
    fontSize: RFValue(16),
    textAlign: 'center',
    marginTop: 80,
    marginBottom: 67,
  },
  body: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 20,
  },
  statusText: {
    marginBottom: 10,
    textAlign: 'center',
  },
});

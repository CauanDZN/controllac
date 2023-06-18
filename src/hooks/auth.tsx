import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';
import {useNavigation} from '@react-navigation/native';

interface AuthProviderProps {
  children: ReactNode;
}

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

interface IAuthContextData {
  user: User;
  signInWithGoogle(): Promise<void>;
  signOut(): Promise<void>;
}

const AuthContext = createContext({} as IAuthContextData);

function AuthProvider({children}: AuthProviderProps) {
  const [user, setUser] = useState<User>({} as User);
  const [userStorageLoading, setUserStorageLoading] = useState(true);

  const userStorageKey = '@controllac:user';

  async function signInWithGoogle() {
    try {
      const config = {
        clientId:
          '31574783943-7fmj5psg7vrpu8tj8d8ikjsb8d4oqd03.apps.googleusercontent.com',
        redirectUrl: AuthSession.makeRedirectUri({
          useProxy: true,
          native: 'com.controllac:/',
        }),
        scopes: ['openid', 'profile', 'email'],
      };

      const {type, params} = (await AuthSession.startAsync({
        authUrl: `https://accounts.google.com/o/oauth2/v2/auth?client_id=${
          config.clientId
        }&redirect_uri=${encodeURIComponent(
          config.redirectUrl,
        )}&response_type=token&scope=${config.scopes.join('%20')}`,
      })) as AuthSession.TokenResponse;

      if (type === 'success') {
        const response = await fetch(
          `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`,
        );
        const userInfo = await response.json();

        const userLogged = {
          id: userInfo.id,
          email: userInfo.email,
          name: userInfo.given_name,
          photo: userInfo.picture,
        };

        setUser(userLogged);
        await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged));
      }
    } catch (error) {
      throw new Error('Não foi possível conectar à conta do Google');
    }
  }

  async function signOut() {
    setUser({} as User);
    await AsyncStorage.removeItem(userStorageKey);
  }

  useEffect(() => {
    async function loadUserStorageData() {
      const userStoraged = await AsyncStorage.getItem(userStorageKey);

      if (userStoraged) {
        const userLogged = JSON.parse(userStoraged) as User;
        setUser(userLogged);
      }

      setUserStorageLoading(false);
    }

    loadUserStorageData();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        signInWithGoogle,
        signOut,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);

  return context;
}

export {AuthProvider, useAuth};

// async function signInWithGoogle() {
//   try {
//     const CLIENT_ID =
//       '326783233616-js5q38hcadg124mjlelt2ntoplhhvoto.apps.googleusercontent.com';
//     const REDIRECT_URI = 'https://auth.expo.io/@cauandzn/controllac';

//     const RESPONSE_TYPE = 'token';
//     const SCOPE = encodeURI('profile email');

//     const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

//     const {type, params} = (await AuthSession.startAsync({
//       authUrl,
//     })) as AuthorizationResponse;

//     if (type === 'success') {
//       const response = await fetch(
//         `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`,
//       );
//       const userInfo = await response.json();

//       const userLogged = {
//         id: userInfo.id,
//         email: userInfo.email,
//         name: userInfo.given_name,
//         photo: userInfo.picture,
//       };

//       setUser(userLogged);
//       await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged));
//     }
//   } catch (error) {
//     throw new Error(error);
//   }
// }

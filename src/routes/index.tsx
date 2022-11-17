import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppRoutes } from './app.routes';
import { ScannerFunction } from '../screens/ScannerFunction';
import { useAuth } from '../hooks/auth';

import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins'
import { SignInScreen } from '../screens/SignIn';

export function Routes() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Controllac" component={AppRoutes} options={{
            headerShown: false
          }}/>
          <Stack.Screen name="ScannerFunction" component={ScannerFunction} options={{
            headerTitle: "Scanner"
          }} />
        </Stack.Navigator>
    </NavigationContainer>
  );
}
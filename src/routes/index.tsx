import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {Backup} from '@/screens/Backup';
import {LoteForm} from '@/screens/LoteForm';
import {Notifications} from '@/screens/Notifications';
import {ProdutoForm} from '@/screens/ProdutoForm';

import {AppRoutes} from './app.routes';
import {RootStackParamList} from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Tabs" component={AppRoutes} />
        <Stack.Screen
          name="LoteForm"
          component={LoteForm}
          options={{presentation: 'modal'}}
        />
        <Stack.Screen
          name="ProdutoForm"
          component={ProdutoForm}
          options={{presentation: 'modal'}}
        />
        <Stack.Screen
          name="Backup"
          component={Backup}
          options={{presentation: 'modal'}}
        />
        <Stack.Screen
          name="Notifications"
          component={Notifications}
          options={{presentation: 'modal'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

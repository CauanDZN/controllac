import React from 'react';
import {Platform} from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useTheme} from 'styled-components';

import {Lotes} from '@/screens/Lotes';
import {Products} from '@/screens/Products';
import {Register} from '@/screens/Register';
import {Resume} from '@/screens/Resume';
import {Scanner} from '@/screens/Scanner';

import {AppTabParamList} from './types';

const {Navigator, Screen} = createBottomTabNavigator<AppTabParamList>();

export function AppRoutes() {
  const theme = useTheme();

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.secondary,
        tabBarInactiveTintColor: theme.colors.text,
        tabBarStyle: {
          paddingVertical: Platform.OS === 'ios' ? 20 : 0,
          height: 50,
        },
      }}>
      <Screen
        name="Lotes"
        component={Lotes}
        options={{
          tabBarIcon: ({size, color}) => (
            <MaterialIcons
              name="format-list-bulleted"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Screen
        name="Produtos"
        component={Products}
        options={{
          tabBarIcon: ({size, color}) => (
            <MaterialIcons name="inventory" size={size} color={color} />
          ),
        }}
      />

      <Screen
        name="Scanner"
        component={Scanner}
        options={{
          tabBarIcon: ({size, color}) => (
            <MaterialIcons name="qr-code-scanner" size={size} color={color} />
          ),
        }}
      />

      <Screen
        name="Cadastrar"
        component={Register}
        options={{
          tabBarIcon: ({size, color}) => (
            <MaterialIcons name="add-circle" size={size} color={color} />
          ),
        }}
      />

      <Screen
        name="Resumo"
        component={Resume}
        options={{
          tabBarIcon: ({size, color}) => (
            <MaterialIcons name="pie-chart" size={size} color={color} />
          ),
        }}
      />
    </Navigator>
  );
}

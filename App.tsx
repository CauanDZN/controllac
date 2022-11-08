import 'react-native-gesture-handler';
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';

import React from 'react';
import { ThemeProvider } from 'styled-components';

import { Routes } from './src/routes';

import theme from './src/global/styles/theme';

import { AuthProvider } from './src/hooks/auth';

export default function App() {

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </ThemeProvider>
  )
}

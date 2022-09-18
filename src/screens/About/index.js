import React from 'react';
import { View, Text } from 'react-native';

import { styles } from './styles';

export function About() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text}>Controllac</Text>
      </View>

      <View style={styles.container}>
        <Text>Controllac</Text>
      </View>
    </View>
  );
}
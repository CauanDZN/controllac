import React from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';

interface MyLinkProps {
  title: string;
  onPress: () => void;
}
export function MyLink({title, onPress}: MyLinkProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  text: {
    marginTop: 16,
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 16,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
});

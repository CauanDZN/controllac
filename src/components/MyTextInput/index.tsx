import React from 'react';
import {StyleSheet, TextInput, TextInputProps} from 'react-native';

export function MyTextInput(props: TextInputProps) {
  return (
    <TextInput
      autoCapitalize="none"
      placeholderTextColor="#ffffff"
      style={styles.input}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderRadius: 8,
    borderColor: '#ffc400',
    paddingHorizontal: 8,
    color: '#ffffff',
    borderWidth: 1,
    width: '100%',
    height: 50,
    marginBottom: 16,
  },
});

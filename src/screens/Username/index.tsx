import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState} from 'react';
import {View, Text, Button} from 'react-native';
import {MyTextInput} from '../../components/MyTextInput';

export function Username() {
  const [username, setUsername] = useState('');

  async function handleUsername() {
    await AsyncStorage.setItem('token', username);
  }

  return (
    <View>
      <Text>Como deseja se chamar?</Text>
      <MyTextInput
        placeholder="Nome"
        onChangeText={name => setUsername(name)}
      />
      <Button title="Entrar!" onPress={handleUsername} />
    </View>
  );
}

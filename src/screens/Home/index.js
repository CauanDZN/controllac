import React from 'react';
import { View, Text, Button, FlatList, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';

import { styles } from './styles';

export function Home({ navigation }) {

    function handleNewLot() {
        navigation.navigate("Register")
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.text}>Controllac</Text>
            </View>

            <View>
                <Button
                    title="ESCANEAR"
                    onPress={() => navigation.navigate('Scanner')}
                />
            </View>

            <View>
                <Text>
                    Olá, Talita.
                </Text>

                <Text>
                    Lotes cadastrados:
                </Text>

                <FlatList
                    horizontal={true}
                />

                <Button title='Criar' onPress={handleNewLot} />

                <Text>
                    Lotes perto do prazo de validade:
                </Text>
            </View>
        </View>
    );
}
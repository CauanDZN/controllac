import { useState } from 'react';
import { View, Text, Alert, Button, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

export function Register() {
    const [isLoading, setIsLoading] = useState(false);
    const [lot, setLot] = useState('');
    const [description, setDescription] = useState('');

    const navigation = useNavigation();

    function handleNewOrderRegister() {
        if (!lot || !description) {
            return Alert.alert('Registrar', 'Preencha todos os campos.');
        }

        setIsLoading(true);

        firestore()
            .collection('lots')
            .doc('00005')
            .set({
                lot,
                description,
                created_at: firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
                Alert.alert("Cadastrado!", "Lote registrado com sucesso.");
                navigation.navigate("Home");
            })
            .catch((error) => {
                console.log(error);
                setIsLoading(false);
                return Alert.alert('Erro!', 'Não foi possível registrar o pedido. Verifique sua conexão com a internet.');
            });
    }

    return (
        <View>
            <Text>Adicionar</Text>

            <TextInput
                placeholder="Nome do lote"
                onChangeText={setLot}
            />

            <TextInput
                placeholder="Descrição do lote"
                multiline
                textAlignVertical="top"
                onChangeText={setDescription}
            />

            <Button
                title="Cadastrar"
                mt={5}
                isLoading={isLoading}
                onPress={handleNewOrderRegister}
            />
        </View>
    )
}
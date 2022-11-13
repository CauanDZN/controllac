import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Alert, Button } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useNavigation } from '@react-navigation/native';
import { Clipboard } from 'react-native'
import { Audio } from "expo-av";

export function ScannerFunction() {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [text, setText] = useState('Aguardando escaneamento!')
    const [sound, setSound] = useState();

    const navigation = useNavigation();

    async function playSound() {
        const { sound } = await Audio.Sound.createAsync(require('../../assets/scanner_bip.mp3')
        );
        setSound(sound);
        await sound.playAsync();
    }

    const askForCameraPermission = () => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted')
        })()
    }

    useEffect(() => {
        askForCameraPermission();
    }, [])

    const handleBarCodeScanned = ({ data }) => {
        setScanned(true);
        setText(data);
        playSound();
    }

    async function copyToClipboard() {
        await Clipboard.setString(text);
        Alert.alert("Copiado!", "Código de barras copiado para a área de transferências.")
    };

    if (!hasPermission === null) {
        return (
            <View style={styles.container}>
                <Text>Aguardando câmera...</Text>
            </View>)
    }
    if (hasPermission === false) {
        return (
            <View style={styles.container}>
                <Text style={{ margin: 10 }}>Sem acesso a câmera.</Text>
                <Button title={'Permitir câmera'} onPress={() => askForCameraPermission()} />
            </View>)
    }
    
    return (
        <View style={styles.container}>
            <View style={styles.barcodebox}>
                <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                    style={{ height: 500, width: 500 }} />
            </View>
            <Text style={styles.maintext}>{text}</Text>

            {scanned && (
                <>
                    <Button
                        title={'Escanear de novo'}
                        onPress={() => setScanned(false)}
                        color='tomato'
                    />

                    <Button
                        title={'Copiar código de barras'}
                        onPress={() => copyToClipboard(text)}
                        color='tomato'
                    />

                    <Button
                        title={'Cadastrar'}
                        onPress={() => navigation.navigate("Cadastrar")}
                        color='tomato'
                    />
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    maintext: {
        fontSize: 16,
        margin: 20,
    },
    barcodebox: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 300,
        width: 500,
        overflow: 'hidden',
        borderRadius: 30,
        backgroundColor: 'transparent'
    }
});
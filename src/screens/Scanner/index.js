import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useNavigation } from '@react-navigation/native';

export function Scanner() {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [text, setText] = useState('Aguardando escaneamento.')

    const navigation = useNavigation();

    const askForCameraPermission = () => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted')
        })()
    }

    useEffect(() => {
        askForCameraPermission();
    }, [])

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        setText(data);
    }

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
                <Button title={'Allow Camera'} onPress={() => askForCameraPermission()} />
            </View>)
    }

    // Return the View
    return (
        <View style={styles.container}>
            <View style={styles.barcodebox}>
                <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                    style={{ height: 400, width: 400 }} />
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
                        title={'Cadastrar'}
                        onPress={() => navigation.navigate("Register")}
                        color='tomato'
                    />

                    <Button
                        title={'Verificar validade'}
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
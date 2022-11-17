import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Alert, Button } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { BarCodeScanner } from "expo-barcode-scanner";

import {
    Header,
    Title
} from "./styles"

export function Scanner() {
    const [hasPermission, setHasPermission] = useState(null);
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

    return (
        <View style={styles.container}>
            <Header>
                <Title>Scanner</Title>
            </Header>

            <View style={styles.button}>
                <Text>Clique no botão para escanear!</Text>
                <Button title="Escanear" onPress={() => navigation.navigate("ScannerFunction")}></Button>
            </View>
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 0
    },
    button: {
        padding: 30
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
import React, {useState} from 'react';
import {Alert} from 'react-native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {BarcodeType, CameraView, useCameraPermissions} from 'expo-camera';
import * as Clipboard from 'expo-clipboard';
import {useAudioPlayer} from 'expo-audio';

import {Button} from '@/components/Button';
import {AppTabParamList} from '@/routes/types';

import {
  ActionsStack,
  CameraArea,
  CenterContainer,
  Container,
  Header,
  InfoText,
  ScannedCode,
  ScannedLabel,
  ScannedPanel,
  Title,
} from './styles';

const BARCODE_TYPES: BarcodeType[] = [
  'ean13',
  'ean8',
  'upc_a',
  'upc_e',
  'code128',
  'qr',
];

type Props = BottomTabScreenProps<AppTabParamList, 'Scanner'>;

export function Scanner({navigation}: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedCode, setScannedCode] = useState<string>();

  const beepPlayer = useAudioPlayer(require('../../assets/scanner_bip.mp3'));

  function handleBarcodeScanned({data}: {data: string}) {
    setScannedCode(data);
    beepPlayer.seekTo(0);
    beepPlayer.play();
  }

  async function handleCopyToClipboard() {
    if (!scannedCode) {
      return;
    }

    await Clipboard.setStringAsync(scannedCode);
    Alert.alert(
      'Copiado!',
      'Código de barras copiado para a área de transferência.',
    );
  }

  function handleRegisterProduct() {
    if (!scannedCode) {
      return;
    }

    navigation.navigate('Cadastrar', {barcode: scannedCode});
    setScannedCode(undefined);
  }

  if (!permission) {
    return (
      <Container>
        <Header>
          <Title>Scanner</Title>
        </Header>
        <CenterContainer>
          <InfoText>Aguardando câmera...</InfoText>
        </CenterContainer>
      </Container>
    );
  }

  if (!permission.granted) {
    return (
      <Container>
        <Header>
          <Title>Scanner</Title>
        </Header>
        <CenterContainer>
          <InfoText>
            Precisamos da sua permissão para usar a câmera e ler o código de
            barras dos produtos.
          </InfoText>
          <Button title="Permitir câmera" onPress={requestPermission} />
        </CenterContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Scanner</Title>
      </Header>

      <CameraArea>
        <CameraView
          style={{flex: 1}}
          facing="back"
          barcodeScannerSettings={{barcodeTypes: BARCODE_TYPES}}
          onBarcodeScanned={scannedCode ? undefined : handleBarcodeScanned}
        />
      </CameraArea>

      {scannedCode && (
        <ScannedPanel>
          <ScannedLabel>Código lido</ScannedLabel>
          <ScannedCode>{scannedCode}</ScannedCode>

          <ActionsStack>
            <Button title="Cadastrar produto" onPress={handleRegisterProduct} />
            <Button title="Copiar código" onPress={handleCopyToClipboard} />
            <Button
              title="Escanear novamente"
              onPress={() => setScannedCode(undefined)}
            />
          </ActionsStack>
        </ScannedPanel>
      )}
    </Container>
  );
}

import React, {useState} from 'react';
import {Alert} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {Button} from '@/components/Button';
import {RootStackParamList} from '@/routes/types';
import {exportBackup, importBackup} from '@/utils/backup';

import {
  CloseButton,
  CloseIcon,
  Container,
  Content,
  Header,
  Section,
  SectionText,
  SectionTitle,
  Title,
} from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Backup'>;

export function Backup({navigation}: Props) {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  async function handleExport() {
    if (isExporting) {
      return;
    }

    setIsExporting(true);

    try {
      await exportBackup();
    } catch {
      Alert.alert('Não foi possível exportar o backup');
    } finally {
      setIsExporting(false);
    }
  }

  function handleImport() {
    if (isImporting) {
      return;
    }

    Alert.alert(
      'Importar backup',
      'Isso vai substituir todos os produtos e lotes cadastrados neste aparelho pelos dados do arquivo escolhido. Continuar?',
      [
        {text: 'Cancelar', style: 'cancel'},
        {text: 'Importar', style: 'destructive', onPress: runImport},
      ],
    );
  }

  async function runImport() {
    setIsImporting(true);

    try {
      const result = await importBackup();

      if (result) {
        Alert.alert(
          'Backup importado',
          `${result.productsCount} produto(s) e ${result.batchesCount} lote(s) restaurados.`,
        );
      }
    } catch {
      Alert.alert(
        'Não foi possível importar o backup',
        'Verifique se o arquivo escolhido é um backup válido do Controllac.',
      );
    } finally {
      setIsImporting(false);
    }
  }

  return (
    <Container>
      <Header>
        <Title>Backup</Title>

        <CloseButton onPress={() => navigation.goBack()}>
          <CloseIcon name="x" />
        </CloseButton>
      </Header>

      <Content>
        <Section>
          <SectionTitle>Exportar</SectionTitle>
          <SectionText>
            Gera um arquivo com todos os produtos e lotes cadastrados neste
            aparelho, pra guardar ou levar pra outro celular.
          </SectionText>
          <Button
            title={isExporting ? 'Exportando...' : 'Exportar backup'}
            onPress={handleExport}
          />
        </Section>

        <Section>
          <SectionTitle>Importar</SectionTitle>
          <SectionText>
            Restaura produtos e lotes a partir de um arquivo de backup exportado
            anteriormente. Isso substitui os dados atuais deste aparelho.
          </SectionText>
          <Button
            title={isImporting ? 'Importando...' : 'Importar backup'}
            onPress={handleImport}
          />
        </Section>
      </Content>
    </Container>
  );
}

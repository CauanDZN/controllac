import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {useFocusEffect} from '@react-navigation/native';
import {useTheme} from 'styled-components';
import auth from '@react-native-firebase/auth';

import {MyButton} from '../../components/MyButton';

import userPhoto from '../../assets/userPhotoDefault.png';

import {
  TransactionCard,
  TransactionCardProps,
} from '../../components/TransactionCard';

import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  // Icon,
  Transactions,
  Title,
  TransactionList,
  LogoutButton,
  LoadContainer,
} from './styles';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<DataListProps[]>([]);

  const theme = useTheme();

  function signOut() {
    auth().signOut();
  }

  function handleDeleteTransaction(id: string) {
    const updatedTransactions = transactions.filter(
      transaction => transaction.id !== id,
    );
    setTransactions(updatedTransactions);
  }

  async function loadTransactions() {
    const dataKey = '@controllac:transactions';
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    const transactionsFormatted: DataListProps[] = transactions.map(
      ({
        barcode,
        date,
        id,
        name,
        category,
        expiration,
        fabrication,
        amount,
      }: DataListProps) => {
        return {
          id,
          name,
          barcode,
          expiration,
          fabrication,
          category,
          amount,
        };
      },
    );
    setTransactions(transactionsFormatted);

    setIsLoading(false);
  }

  function deleteTransactions() {
    const dataKey = '@controllac:transactions';
    AsyncStorage.removeItem(dataKey);
  }

  async function deleteTransaction(id: string) {
    const dataKey = '@controllac:transactions';
    const storedTransactions = await AsyncStorage.getItem(dataKey);

    if (storedTransactions) {
      const transactions: DataListProps[] = JSON.parse(storedTransactions);
      const updatedTransactions = transactions.filter(
        transaction => transaction.id !== id,
      );

      await AsyncStorage.setItem(dataKey, JSON.stringify(updatedTransactions));
      setTransactions(updatedTransactions);
    }
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, []),
  );

  return (
    <Container>
      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadContainer>
      ) : (
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo source={userPhoto} />
                <User>
                  <UserGreeting>Olá,</UserGreeting>
                  <UserName>Usuário</UserName>
                </User>
              </UserInfo>

              {/* <MyButton onPress={signOut} title="Sair" /> */}
            </UserWrapper>
          </Header>

          <Transactions>
            <Title>Listagem</Title>

            <TransactionList
              data={transactions}
              keyExtractor={item => item.id}
              renderItem={({item}) => (
                <TransactionCard
                  data={item}
                  onDelete={deleteTransaction}
                  key={item.id}
                />
              )}
            />
          </Transactions>
        </>
      )}
    </Container>
  );
}

import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from 'styled-components';
import { useAuth } from "../../hooks/auth";

import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';

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
  LoadContainer
} from './styles'


export interface DataListProps extends TransactionCardProps {
  id: string;
}

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<DataListProps[]>([]);

  const theme = useTheme();
  const { user, signOut } = useAuth();

  async function loadTransactions() {
    const dataKey = `@controllac:transactions`;
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    const transactionsFormatted: DataListProps[] = transactions.map(
      ({ barcode, date, id, name, category, expiration, fabrication }: DataListProps) => {

        const dateFormatted = Intl.DateTimeFormat("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).format(new Date(date));

        return {
          id,
          name,
          barcode,
          expiration,
          fabrication,
          date: dateFormatted,
          category,
        };
      }
    );
    setTransactions(transactionsFormatted);

    setIsLoading(false);
  }

  function deleteTransactions() {
    const dataKey = `@gofinances:transactions_user:${user.id}`;
    AsyncStorage.removeItem(dataKey);
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  useFocusEffect(useCallback(() => {
    loadTransactions();
  }, []));


  return (
    <Container>
      {
        isLoading ?
          <LoadContainer>
            <ActivityIndicator
              color={theme.colors.primary}
              size="large"
            />
          </LoadContainer> :
          <>
            <Header>
              <UserWrapper>
                <UserInfo>
                  <Photo
                    source={{
                      uri: user.photo,
                    }}
                  />
                  <User>
                    <UserGreeting>Olá,</UserGreeting>
                    <UserName>{user.name}</UserName>
                  </User>
                </UserInfo>

                <LogoutButton onPress={signOut}>
                  {/* <Icon name="power" /> */}
                </LogoutButton>
              </UserWrapper>

            </Header>

            <Transactions>
              <Title>Listagem</Title>

              <TransactionList
                data={transactions}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <TransactionCard data={item} />}
              />
            </Transactions>
          </>
      }
    </Container>
  )
}
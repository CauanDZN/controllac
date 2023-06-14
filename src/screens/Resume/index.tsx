import React, {useState, useCallback, useEffect} from 'react';
import {ActivityIndicator} from 'react-native';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {VictoryPie} from 'victory-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {addMonths, format, subMonths} from 'date-fns';
import {ptBR} from 'date-fns/locale';
import {useTheme} from 'styled-components/native';
import {useFocusEffect} from '@react-navigation/native';

import {HistoryCard} from '../../components/HistoryCard';
import {categories} from '../../utils/categories';
import {
  Container,
  Header,
  Title,
  LoadContainer,
  Content,
  MonthSelect,
  MountSelectButton,
  MonthSelectIcon,
  Month,
  ChartContainer,
} from './styles';
import {View} from 'react-native';
import {Text} from 'react-native';

interface TransactionData {
  name: string;
  amount: string;
  category: string;
  date: string;
}

interface CategoryData {
  key: string;
  name: string;
  totalFormatted: string;
  percent: string;
  color: string;
  products: TransactionData[];
}

export function Resume() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>(
    [],
  );
  const theme = useTheme();

  function handleDateChange(action: 'next' | 'prev') {
    if (action === 'next') {
      setSelectedDate(addMonths(selectedDate, 1));
    } else {
      setSelectedDate(subMonths(selectedDate, 1));
    }
  }

  async function loadData() {
    setIsLoading(true);

    const dataKey = '@controllac:transactions';
    const response = await AsyncStorage.getItem(dataKey);
    const responseFormatted: TransactionData[] = response
      ? JSON.parse(response)
      : [];

    const expensives = responseFormatted.filter(
      expensive =>
        new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
        new Date(expensive.date).getFullYear() === selectedDate.getFullYear(),
    );

    const expensivesTotal = expensives.reduce(
      (accumulator: number, expensive: TransactionData) => {
        return accumulator + Number(expensive.amount);
      },
      0,
    );

    const totalByCategory: CategoryData[] = [];

    categories.forEach(category => {
      let categorySum = 0;
      const products: TransactionData[] = [];

      expensives.forEach(expensive => {
        if (expensive.category === category.key) {
          categorySum += Number(expensive.amount);
          products.push(expensive);
        }
      });

      if (categorySum > 0) {
        const totalFormatted = categorySum.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        });

        const percent = `${((categorySum / expensivesTotal) * 100).toFixed(
          0,
        )}%`;

        totalByCategory.push({
          key: category.key,
          name: category.name,
          totalFormatted,
          percent,
          color: category.color,
          products,
        });
      }
    });

    setTotalByCategories(totalByCategory);
    setIsLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [selectedDate]),
  );

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>
      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadContainer>
      ) : (
        <Content
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: useBottomTabBarHeight(),
          }}>
          <MonthSelect>
            <MountSelectButton onPress={() => handleDateChange('prev')}>
              <MonthSelectIcon name="chevron-left" />
            </MountSelectButton>

            <Month>{format(selectedDate, 'MMMM, yyyy', {locale: ptBR})}</Month>

            <MountSelectButton onPress={() => handleDateChange('next')}>
              <MonthSelectIcon name="chevron-right" />
            </MountSelectButton>
          </MonthSelect>

          {categories.map(category => (
            <View key={category.key}>
              <Text>{category.name}</Text>
              <Text>{category.color}</Text>
            </View>
          ))}
        </Content>
      )}
    </Container>
  );
}

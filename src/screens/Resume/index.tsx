import React, {useState, useCallback, useEffect} from 'react';
import {ActivityIndicator, Button, Modal, TouchableOpacity} from 'react-native';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {VictoryPie} from 'victory-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {addMonths, format, subMonths} from 'date-fns';
import {ptBR} from 'date-fns/locale';
import {useTheme} from 'styled-components/native';
import {useFocusEffect} from '@react-navigation/native';

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
import {View, Text} from 'react-native';
import {TransactionCard} from '../../components/TransactionCard';

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
  const [productCounts, setProductCounts] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [categoryWithMaxCount, setCategoryWithMaxCount] = useState(null);
  const [transactionChanged, setTransactionChanged] = useState(false);
  const [hasTransactions, setHasTransactions] = useState(false);
  const [categoriesWithMaxCount, setCategoriesWithMaxCount] = useState([]);
  const [selectedCategoryProducts, setSelectedCategoryProducts] = useState([]);

  useEffect(() => {
    loadProductCounts();
  }, []);

  async function updateProductCounts(transactions: TransactionData[]) {
    const productCountsData = {};

    // Contagem de produtos por categoria
    for (const category of categories) {
      const categoryKey = category.key;
      const categoryProducts = transactions.filter(
        transaction => transaction.category === categoryKey,
      );
      const productCount = categoryProducts.length;
      productCountsData[categoryKey] = productCount;
    }

    setProductCounts(productCountsData);
  }

  async function loadProductCounts() {
    const productCountsData = {};

    // Obtenha os registros do AsyncStorage
    const dataKey = '@controllac:transactions';
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    // Contagem de produtos por categoria
    for (const category of categories) {
      const categoryKey = category.key;
      const categoryProducts = transactions.filter(
        transaction => transaction.category === categoryKey,
      );
      const productCount = categoryProducts.length;
      productCountsData[categoryKey] = productCount;
    }

    setProductCounts(productCountsData);
    setTransactionChanged(true);
  }

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

    const transactionsExist = responseFormatted.length > 0;

    setHasTransactions(transactionsExist);

    let totalTransactions = responseFormatted.length;

    const totalByCategoriesData: CategoryData[] = categories.map(category => {
      const categoryProducts = responseFormatted.filter(
        transaction => transaction.category === category.key,
      );
      const totalFormatted = String(categoryProducts.length);
      const percent = (
        (categoryProducts.length / totalTransactions) *
        100
      ).toFixed(0);
      return {
        ...category,
        totalFormatted,
        percent,
        products: categoryProducts,
      };
    });

    const categoryCounts = categories.map(category => ({
      categoryKey: category.key,
      count:
        totalByCategoriesData.find(item => item.key === category.key)?.products
          .length || 0,
    }));

    let categoriesWithMaxCount = [];

    if (totalTransactions > 0) {
      const maxCount = Math.max(...categoryCounts.map(item => item.count));
      categoriesWithMaxCount = categoryCounts
        .filter(item => item.count === maxCount)
        .map(item => item.categoryKey);
    }

    setTotalByCategories(totalByCategoriesData);
    setCategoriesWithMaxCount(categoriesWithMaxCount);
    setCategoryWithMaxCount(categoryWithMaxCount);
    setIsLoading(false);

    updateProductCounts(responseFormatted); // Atualiza os registros
  }

  function handleCategoryPress(category) {
    const categoryProducts = totalByCategories.find(
      item => item.key === category.key,
    ).products;
    setSelectedCategory({...category, products: categoryProducts});
    setSelectedCategoryProducts(categoryProducts); // Definir os produtos da categoria selecionada
    setModalVisible(true);
    updateProductCounts(categoryProducts); // Atualizar os registros da categoria selecionada
  }

  function closeModal() {
    setSelectedCategory(null);
    setModalVisible(false);
  }

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [selectedDate, transactionChanged]),
  );

  useEffect(() => {
    loadData();
    setTransactionChanged(false);
  }, [selectedDate, transactionChanged]);

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

          {hasTransactions ? (
            <>
              <ChartContainer>
                <VictoryPie
                  data={totalByCategories.map(category => ({
                    x: category.name,
                    y: Number(category.totalFormatted.replace(/[^\d.]/g, '')),
                  }))}
                  colorScale={totalByCategories.map(category => category.color)}
                  innerRadius={70}
                  labels={({datum}) => `${datum.x}\n${datum.y}`}
                  labelRadius={({innerRadius}) => innerRadius + 50}
                  style={{
                    labels: {
                      fontSize: RFValue(14),
                      fontWeight: 'bold',
                      fill: '#8d8d8d',
                    },
                  }}
                  events={[
                    {
                      target: 'data',
                      eventHandlers: {
                        onMouseOver: () => {
                          return [
                            {
                              target: 'data',
                              mutation: () => ({
                                style: {opacity: 1},
                              }),
                            },
                          ];
                        },
                        onMouseOut: () => {
                          return [
                            {
                              target: 'data',
                              mutation: () => {},
                            },
                          ];
                        },
                      },
                    },
                  ]}
                />
                {categoriesWithMaxCount.length > 1 ? (
                  <Text style={{alignSelf: 'center', marginTop: -20}}>
                    Categorias com mais registros:{' '}
                    {categoriesWithMaxCount
                      .map(
                        categoryKey =>
                          categories.find(
                            category => category.key === categoryKey,
                          )?.name,
                      )
                      .join(' ')}
                  </Text>
                ) : (
                  <Text style={{alignSelf: 'center', marginTop: -20}}>
                    Categoria com mais registros:{' '}
                    {
                      categories.find(
                        category => category.key === categoriesWithMaxCount[0],
                      )?.name
                    }
                  </Text>
                )}
              </ChartContainer>
            </>
          ) : (
            <Text style={{alignSelf: 'center', marginTop: 20}}>
              Não há gráficos para exibir.
            </Text>
          )}

          {categories.map(category => (
            <TouchableOpacity
              key={category.key}
              onPress={() => handleCategoryPress(category)}>
              <View style={{marginTop: 8}}>
                <Text style={{color: category.color}}>{category.name}</Text>
                <Text>Registros: {productCounts[category.key]}</Text>
              </View>
            </TouchableOpacity>
          ))}

          <Modal visible={modalVisible} animationType="slide">
            <View>
              <Text>Nome: {selectedCategory?.name}</Text>
              <Text>Cor: {selectedCategory?.color}</Text>
              {selectedCategoryProducts.map(product => (
                <TransactionCard key={product.id} data={product} />
              ))}
              <Button title="Fechar" onPress={closeModal} />
            </View>
          </Modal>
        </Content>
      )}
    </Container>
  );
}

import React, {useCallback, useMemo, useState} from 'react';
import {ActivityIndicator, Modal} from 'react-native';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {useFocusEffect} from '@react-navigation/native';
import {addMonths, format, isSameMonth, parseISO, subMonths} from 'date-fns';
import {ptBR} from 'date-fns/locale';
import {PieChart} from 'react-native-gifted-charts';
import {useTheme} from 'styled-components/native';

import {Button} from '@/components/Button';
import {ProductCard} from '@/components/ProductCard';
import {productsStorage} from '@/storage/productsStorage';
import {Product} from '@/types/product';
import {Category, categories} from '@/utils/categories';

import {
  CategoryCount,
  CategoryDot,
  CategoryInfo,
  CategoryList,
  CategoryName,
  CategoryRow,
  CenterLabel,
  CenterLabelText,
  CenterLabelValue,
  ChartContainer,
  Container,
  Content,
  EmptyText,
  Header,
  HighlightText,
  LoadContainer,
  Month,
  MonthSelect,
  MonthSelectButton,
  MonthSelectIcon,
  ModalContainer,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Title,
} from './styles';

type CategorySummary = Category & {products: Product[]};

export function Resume() {
  const [isLoading, setIsLoading] = useState(true);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string>();

  const theme = useTheme();
  const bottomTabBarHeight = useBottomTabBarHeight();

  useFocusEffect(
    useCallback(() => {
      let active = true;

      productsStorage.getAll().then(products => {
        if (active) {
          setAllProducts(products);
          setIsLoading(false);
        }
      });

      return () => {
        active = false;
      };
    }, []),
  );

  function handleDateChange(action: 'next' | 'prev') {
    setSelectedDate(current =>
      action === 'next' ? addMonths(current, 1) : subMonths(current, 1),
    );
  }

  async function handleDeleteProduct(id: string) {
    await productsStorage.remove(id);
    setAllProducts(current => current.filter(product => product.id !== id));
  }

  const productsInMonth = useMemo(
    () =>
      allProducts.filter(product =>
        isSameMonth(parseISO(product.createdAt), selectedDate),
      ),
    [allProducts, selectedDate],
  );

  const categoriesSummary = useMemo<CategorySummary[]>(
    () =>
      categories.map(category => ({
        ...category,
        products: productsInMonth.filter(
          product => product.category === category.key,
        ),
      })),
    [productsInMonth],
  );

  const categoriesWithProducts = useMemo(
    () => categoriesSummary.filter(category => category.products.length > 0),
    [categoriesSummary],
  );

  const maxCount = useMemo(
    () =>
      categoriesWithProducts.reduce(
        (max, category) => Math.max(max, category.products.length),
        0,
      ),
    [categoriesWithProducts],
  );

  const topCategories = useMemo(
    () =>
      categoriesWithProducts.filter(
        category => category.products.length === maxCount,
      ),
    [categoriesWithProducts, maxCount],
  );

  const selectedCategory = categoriesSummary.find(
    category => category.key === selectedCategoryKey,
  );

  if (isLoading) {
    return (
      <Container>
        <Header>
          <Title>Resumo por categoria</Title>
        </Header>
        <LoadContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>

      <Content
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: bottomTabBarHeight,
        }}>
        <MonthSelect>
          <MonthSelectButton onPress={() => handleDateChange('prev')}>
            <MonthSelectIcon name="chevron-left" />
          </MonthSelectButton>

          <Month>{format(selectedDate, 'MMMM, yyyy', {locale: ptBR})}</Month>

          <MonthSelectButton onPress={() => handleDateChange('next')}>
            <MonthSelectIcon name="chevron-right" />
          </MonthSelectButton>
        </MonthSelect>

        {productsInMonth.length > 0 ? (
          <>
            <ChartContainer>
              <PieChart
                data={categoriesWithProducts.map(category => ({
                  value: category.products.length,
                  color: category.color,
                  text: category.name,
                }))}
                donut
                radius={90}
                innerRadius={60}
                showText
                textColor={theme.colors.text}
                textSize={12}
                centerLabelComponent={() => (
                  <CenterLabel>
                    <CenterLabelValue>
                      {productsInMonth.length}
                    </CenterLabelValue>
                    <CenterLabelText>produtos</CenterLabelText>
                  </CenterLabel>
                )}
              />

              <HighlightText>
                {topCategories.length > 1
                  ? 'Categorias com mais registros: '
                  : 'Categoria com mais registros: '}
                {topCategories.map(category => category.name).join(', ')}
              </HighlightText>
            </ChartContainer>

            <CategoryList>
              {categoriesWithProducts.map(category => (
                <CategoryRow
                  key={category.key}
                  onPress={() => setSelectedCategoryKey(category.key)}>
                  <CategoryInfo>
                    <CategoryDot color={category.color} />
                    <CategoryName>{category.name}</CategoryName>
                  </CategoryInfo>

                  <CategoryCount>{category.products.length}</CategoryCount>
                </CategoryRow>
              ))}
            </CategoryList>
          </>
        ) : (
          <EmptyText>Nenhum produto cadastrado neste mês.</EmptyText>
        )}
      </Content>

      <Modal visible={!!selectedCategory} animationType="slide">
        <ModalContainer>
          <ModalHeader color={selectedCategory?.color ?? theme.colors.primary}>
            <ModalTitle>{selectedCategory?.name}</ModalTitle>
          </ModalHeader>

          <ModalContent>
            {selectedCategory?.products.map(product => (
              <ProductCard
                key={product.id}
                data={product}
                onDelete={handleDeleteProduct}
              />
            ))}
          </ModalContent>

          <ModalFooter>
            <Button
              title="Fechar"
              onPress={() => setSelectedCategoryKey(undefined)}
            />
          </ModalFooter>
        </ModalContainer>
      </Modal>
    </Container>
  );
}

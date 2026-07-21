import React, {useCallback, useMemo, useState} from 'react';
import {ActivityIndicator, Modal} from 'react-native';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {addMonths, format, isSameMonth, parseISO, subMonths} from 'date-fns';
import {ptBR} from 'date-fns/locale';
import {PieChart} from 'react-native-gifted-charts';
import {useTheme} from 'styled-components/native';

import {BatchCard} from '@/components/BatchCard';
import {Button} from '@/components/Button';
import {RootStackParamList} from '@/routes/types';
import {batchesStorage} from '@/storage/batchesStorage';
import {productsStorage} from '@/storage/productsStorage';
import {Batch} from '@/types/batch';
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

type BatchListItem = {
  batch: Batch;
  product: Product;
};

type CategorySummary = Category & {items: BatchListItem[]};

export function Resume() {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string>();

  const theme = useTheme();
  const bottomTabBarHeight = useBottomTabBarHeight();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useFocusEffect(
    useCallback(() => {
      let active = true;

      Promise.all([productsStorage.getAll(), batchesStorage.getAll()]).then(
        ([storedProducts, storedBatches]) => {
          if (active) {
            setProducts(storedProducts);
            setBatches(storedBatches);
            setIsLoading(false);
          }
        },
      );

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

  async function handleDeleteBatch(id: string) {
    await batchesStorage.remove(id);
    setBatches(current => current.filter(batch => batch.id !== id));
  }

  function handleEditBatch(batchId: string) {
    setSelectedCategoryKey(undefined);
    navigation.navigate('LoteForm', {batchId});
  }

  const productsById = useMemo(
    () => new Map(products.map(product => [product.id, product])),
    [products],
  );

  const itemsInMonth = useMemo<BatchListItem[]>(
    () =>
      batches
        .filter(batch => isSameMonth(parseISO(batch.createdAt), selectedDate))
        .map(batch => ({batch, product: productsById.get(batch.productId)}))
        .filter((item): item is BatchListItem => !!item.product),
    [batches, productsById, selectedDate],
  );

  const categoriesSummary = useMemo<CategorySummary[]>(
    () =>
      categories.map(category => ({
        ...category,
        items: itemsInMonth.filter(
          item => item.product.category === category.key,
        ),
      })),
    [itemsInMonth],
  );

  const categoriesWithItems = useMemo(
    () => categoriesSummary.filter(category => category.items.length > 0),
    [categoriesSummary],
  );

  const maxCount = useMemo(
    () =>
      categoriesWithItems.reduce(
        (max, category) => Math.max(max, category.items.length),
        0,
      ),
    [categoriesWithItems],
  );

  const topCategories = useMemo(
    () =>
      categoriesWithItems.filter(
        category => category.items.length === maxCount,
      ),
    [categoriesWithItems, maxCount],
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

        {itemsInMonth.length > 0 ? (
          <>
            <ChartContainer>
              <PieChart
                data={categoriesWithItems.map(category => ({
                  value: category.items.length,
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
                    <CenterLabelValue>{itemsInMonth.length}</CenterLabelValue>
                    <CenterLabelText>lotes</CenterLabelText>
                  </CenterLabel>
                )}
              />

              <HighlightText>
                {topCategories.length > 1
                  ? 'Categorias com mais lotes: '
                  : 'Categoria com mais lotes: '}
                {topCategories.map(category => category.name).join(', ')}
              </HighlightText>
            </ChartContainer>

            <CategoryList>
              {categoriesWithItems.map(category => (
                <CategoryRow
                  key={category.key}
                  onPress={() => setSelectedCategoryKey(category.key)}>
                  <CategoryInfo>
                    <CategoryDot color={category.color} />
                    <CategoryName>{category.name}</CategoryName>
                  </CategoryInfo>

                  <CategoryCount>{category.items.length}</CategoryCount>
                </CategoryRow>
              ))}
            </CategoryList>
          </>
        ) : (
          <EmptyText>Nenhum lote cadastrado neste mês.</EmptyText>
        )}
      </Content>

      <Modal visible={!!selectedCategory} animationType="slide">
        <ModalContainer>
          <ModalHeader color={selectedCategory?.color ?? theme.colors.primary}>
            <ModalTitle>{selectedCategory?.name}</ModalTitle>
          </ModalHeader>

          <ModalContent>
            {selectedCategory?.items.map(({batch, product}) => (
              <BatchCard
                key={batch.id}
                batch={batch}
                product={product}
                onPress={() => handleEditBatch(batch.id)}
                onDelete={handleDeleteBatch}
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

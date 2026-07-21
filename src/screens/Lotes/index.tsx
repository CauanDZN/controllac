import React, {useCallback, useMemo, useState} from 'react';
import {ActivityIndicator, FlatList} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from 'styled-components';

import {BatchCard} from '@/components/BatchCard';
import {LoadError} from '@/components/LoadError';
import {SearchInput} from '@/components/SearchInput';
import {StatusFilter, StatusFilterValue} from '@/components/StatusFilter';
import {RootStackParamList} from '@/routes/types';
import {batchesStorage} from '@/storage/batchesStorage';
import {productsStorage} from '@/storage/productsStorage';
import {Batch} from '@/types/batch';
import {Product} from '@/types/product';
import {getExpirationStatus} from '@/utils/date';

import {
  BackupButton,
  BackupIcon,
  batchListContentContainerStyle,
  batchListStyle,
  Container,
  EmptyContainer,
  EmptyIcon,
  EmptySubtext,
  EmptyText,
  FiltersArea,
  Header,
  HeaderInfo,
  LoadContainer,
  Subtitle,
  Title,
} from './styles';

type BatchListItem = {
  batch: Batch;
  product: Product;
};

export function Lotes() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>('all');

  const theme = useTheme();
  const {top} = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const loadData = useCallback(async () => {
    setHasError(false);

    try {
      const [storedProducts, storedBatches] = await Promise.all([
        productsStorage.getAll(),
        batchesStorage.getAll(),
      ]);

      setProducts(storedProducts);
      setBatches(storedBatches);
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const productsById = useMemo(
    () => new Map(products.map(product => [product.id, product])),
    [products],
  );

  const items = useMemo<BatchListItem[]>(() => {
    const query = search.trim().toLowerCase();

    return batches
      .map(batch => ({batch, product: productsById.get(batch.productId)}))
      .filter((item): item is BatchListItem => !!item.product)
      .filter(
        ({product}) =>
          !query ||
          product.name.toLowerCase().includes(query) ||
          product.barcode.includes(query),
      )
      .filter(
        ({batch}) =>
          statusFilter === 'all' ||
          getExpirationStatus(batch.expirationDate) === statusFilter,
      )
      .sort((a, b) =>
        a.batch.expirationDate.localeCompare(b.batch.expirationDate),
      );
  }, [batches, productsById, search, statusFilter]);

  async function handleDeleteBatch(id: string) {
    await batchesStorage.remove(id);
    setBatches(current => current.filter(batch => batch.id !== id));
  }

  function handleEditBatch(batchId: string) {
    navigation.navigate('LoteForm', {batchId});
  }

  function getSubtitle(): string {
    if (batches.length === 0) {
      return 'Nenhum lote cadastrado';
    }

    const suffix = items.length !== 1 ? 's' : '';
    const verb = search || statusFilter !== 'all' ? 'encontrado' : 'cadastrado';

    return `${items.length} lote${suffix} ${verb}${suffix}`;
  }

  if (isLoading) {
    return (
      <Container>
        <LoadContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header topInset={top}>
        <HeaderInfo>
          <Title>Controllac</Title>
          <Subtitle>{getSubtitle()}</Subtitle>
        </HeaderInfo>

        <BackupButton onPress={() => navigation.navigate('Backup')}>
          <BackupIcon name="shield" />
        </BackupButton>
      </Header>

      {hasError ? (
        <LoadError onRetry={loadData} />
      ) : batches.length === 0 ? (
        <EmptyContainer>
          <EmptyIcon name="package-variant" />
          <EmptyText>Nenhum lote cadastrado ainda</EmptyText>
          <EmptySubtext>
            Use a aba Scanner ou Cadastrar para adicionar o primeiro lote
          </EmptySubtext>
        </EmptyContainer>
      ) : (
        <>
          <FiltersArea>
            <SearchInput
              value={search}
              onChangeText={setSearch}
              placeholder="Buscar por nome ou código de barras"
            />
            <StatusFilter value={statusFilter} onChange={setStatusFilter} />
          </FiltersArea>

          {items.length === 0 ? (
            <EmptyContainer>
              <EmptyIcon name="magnify-close" />
              <EmptyText>Nenhum lote encontrado</EmptyText>
              <EmptySubtext>Tente ajustar a busca ou o filtro</EmptySubtext>
            </EmptyContainer>
          ) : (
            <FlatList
              data={items}
              style={batchListStyle}
              contentContainerStyle={batchListContentContainerStyle}
              showsVerticalScrollIndicator={false}
              keyExtractor={item => item.batch.id}
              renderItem={({item}) => (
                <BatchCard
                  batch={item.batch}
                  product={item.product}
                  onPress={() => handleEditBatch(item.batch.id)}
                  onDelete={handleDeleteBatch}
                />
              )}
            />
          )}
        </>
      )}
    </Container>
  );
}

import React, {useCallback, useMemo, useState} from 'react';
import {ActivityIndicator, FlatList} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from 'styled-components';

import {LoadError} from '@/components/LoadError';
import {ProductListItem} from '@/components/ProductListItem';
import {SearchInput} from '@/components/SearchInput';
import {RootStackParamList} from '@/routes/types';
import {productsStorage} from '@/storage/productsStorage';
import {Product} from '@/types/product';

import {
  AddButton,
  AddIcon,
  Container,
  EmptyContainer,
  EmptyIcon,
  EmptySubtext,
  EmptyText,
  FiltersArea,
  Header,
  HeaderInfo,
  listContentContainerStyle,
  listStyle,
  LoadContainer,
  Subtitle,
  Title,
} from './styles';

export function Products() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');

  const theme = useTheme();
  const {top} = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const loadProducts = useCallback(async () => {
    setHasError(false);

    try {
      const stored = await productsStorage.getAll();
      setProducts(stored);
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [loadProducts]),
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products
      .filter(
        product =>
          !query ||
          product.name.toLowerCase().includes(query) ||
          product.barcode.includes(query),
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [products, search]);

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
          <Title>Produtos</Title>
          <Subtitle>
            {products.length} produto{products.length !== 1 ? 's' : ''} no
            catálogo
          </Subtitle>
        </HeaderInfo>

        <AddButton
          onPress={() => navigation.navigate('ProdutoForm', undefined)}>
          <AddIcon name="plus" />
        </AddButton>
      </Header>

      {hasError ? (
        <LoadError onRetry={loadProducts} />
      ) : products.length === 0 ? (
        <EmptyContainer>
          <EmptyIcon name="tag-outline" />
          <EmptyText>Nenhum produto cadastrado ainda</EmptyText>
          <EmptySubtext>
            Toque no + para cadastrar o primeiro produto do catálogo
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
          </FiltersArea>

          {filtered.length === 0 ? (
            <EmptyContainer>
              <EmptyIcon name="magnify-close" />
              <EmptyText>Nenhum produto encontrado</EmptyText>
              <EmptySubtext>Tente ajustar a busca</EmptySubtext>
            </EmptyContainer>
          ) : (
            <FlatList
              data={filtered}
              style={listStyle}
              contentContainerStyle={listContentContainerStyle}
              showsVerticalScrollIndicator={false}
              keyExtractor={item => item.id}
              renderItem={({item}) => (
                <ProductListItem
                  product={item}
                  onPress={() =>
                    navigation.navigate('ProdutoForm', {productId: item.id})
                  }
                />
              )}
            />
          )}
        </>
      )}
    </Container>
  );
}

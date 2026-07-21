import React, {useCallback, useMemo, useState} from 'react';
import {ActivityIndicator, FlatList} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTheme} from 'styled-components';

import {LoadError} from '@/components/LoadError';
import {ProductListItem} from '@/components/ProductListItem';
import {SearchInput} from '@/components/SearchInput';
import {RootStackParamList} from '@/routes/types';
import {productsStorage} from '@/storage/productsStorage';
import {Product} from '@/types/product';

import {
  Container,
  Content,
  EmptyText,
  Header,
  listContentContainerStyle,
  listStyle,
  LoadContainer,
  NewProductButton,
  NewProductIcon,
  NewProductText,
  SectionLabel,
  Title,
} from './styles';

export function Register() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');

  const theme = useTheme();
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

  return (
    <Container>
      <Header>
        <Title>Cadastrar lote</Title>
      </Header>

      <Content>
        <NewProductButton
          onPress={() =>
            navigation.navigate('ProdutoForm', {chainToLote: true})
          }>
          <NewProductIcon name="plus-circle" />
          <NewProductText>Cadastrar novo produto</NewProductText>
        </NewProductButton>

        <SectionLabel>ou escolha um produto já cadastrado</SectionLabel>

        <SearchInput
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar por nome ou código de barras"
        />

        {isLoading ? (
          <LoadContainer>
            <ActivityIndicator color={theme.colors.primary} size="large" />
          </LoadContainer>
        ) : hasError ? (
          <LoadError onRetry={loadProducts} />
        ) : filtered.length === 0 ? (
          <EmptyText>
            {products.length === 0
              ? 'Nenhum produto cadastrado ainda'
              : 'Nenhum produto encontrado para essa busca'}
          </EmptyText>
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
                  navigation.navigate('LoteForm', {productId: item.id})
                }
              />
            )}
          />
        )}
      </Content>
    </Container>
  );
}

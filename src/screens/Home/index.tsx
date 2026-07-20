import React, {useCallback, useState} from 'react';
import {ActivityIndicator, FlatList} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from 'styled-components';

import {ProductCard} from '@/components/ProductCard';
import {productsStorage} from '@/storage/productsStorage';
import {Product} from '@/types/product';

import {
  Container,
  EmptyContainer,
  EmptyIcon,
  EmptySubtext,
  EmptyText,
  Header,
  LoadContainer,
  productListContentContainerStyle,
  productListStyle,
  Subtitle,
  Title,
} from './styles';

export function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  const theme = useTheme();
  const {top} = useSafeAreaInsets();

  const loadProducts = useCallback(async () => {
    const stored = await productsStorage.getAll();

    const sorted = [...stored].sort((a, b) =>
      a.expirationDate.localeCompare(b.expirationDate),
    );

    setProducts(sorted);
    setIsLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [loadProducts]),
  );

  async function handleDeleteProduct(id: string) {
    await productsStorage.remove(id);
    setProducts(current => current.filter(product => product.id !== id));
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
        <Title>Controllac</Title>
        <Subtitle>
          {products.length === 0
            ? 'Nenhum produto cadastrado'
            : `${products.length} produto${products.length > 1 ? 's' : ''} cadastrado${
                products.length > 1 ? 's' : ''
              }`}
        </Subtitle>
      </Header>

      {products.length === 0 ? (
        <EmptyContainer>
          <EmptyIcon name="package-variant" />
          <EmptyText>Nenhum produto cadastrado ainda</EmptyText>
          <EmptySubtext>
            Use a aba Scanner ou Cadastrar para adicionar o primeiro produto
          </EmptySubtext>
        </EmptyContainer>
      ) : (
        <FlatList
          data={products}
          style={productListStyle}
          contentContainerStyle={productListContentContainerStyle}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <ProductCard data={item} onDelete={handleDeleteProduct} />
          )}
        />
      )}
    </Container>
  );
}

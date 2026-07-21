import React from 'react';

import {Product} from '@/types/product';
import {getCategory} from '@/utils/categories';

import {
  Barcode,
  Container,
  Dot,
  Icon,
  Info,
  LowStockBadge,
  Name,
  NameRow,
} from './styles';

interface Props {
  product: Product;
  onPress: () => void;
  isLowStock?: boolean;
}

export function ProductListItem({product, onPress, isLowStock}: Props) {
  const category = getCategory(product.category);

  return (
    <Container onPress={onPress}>
      <Info>
        <NameRow>
          <Dot color={category.color} />
          <Name>{product.name}</Name>
        </NameRow>
        <Barcode>{product.barcode}</Barcode>
        {isLowStock && <LowStockBadge>Estoque baixo</LowStockBadge>}
      </Info>

      <Icon name="chevron-right" />
    </Container>
  );
}

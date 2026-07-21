import React from 'react';

import {Product} from '@/types/product';
import {getCategory} from '@/utils/categories';

import {Barcode, Container, Dot, Icon, Info, Name, NameRow} from './styles';

interface Props {
  product: Product;
  onPress: () => void;
}

export function ProductListItem({product, onPress}: Props) {
  const category = getCategory(product.category);

  return (
    <Container onPress={onPress}>
      <Info>
        <NameRow>
          <Dot color={category.color} />
          <Name>{product.name}</Name>
        </NameRow>
        <Barcode>{product.barcode}</Barcode>
      </Info>

      <Icon name="chevron-right" />
    </Container>
  );
}

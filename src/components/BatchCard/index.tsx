import React from 'react';

import {Batch} from '@/types/batch';
import {Product} from '@/types/product';
import {getCategory} from '@/utils/categories';
import {formatISODate, getExpirationStatus} from '@/utils/date';

import {
  Barcode,
  CategoryName,
  Container,
  DeleteButton,
  DeleteText,
  Footer,
  Header,
  Label,
  StatusBadge,
  Title,
  TouchableContent,
  Value,
} from './styles';

const statusLabel = {
  expired: 'Vencido',
  expiring: 'Vencendo em breve',
  ok: 'Dentro da validade',
};

interface Props {
  batch: Batch;
  product: Product;
  onPress: () => void;
  onDelete: (id: string) => void;
}

export function BatchCard({batch, product, onPress, onDelete}: Props) {
  const category = getCategory(product.category);
  const status = getExpirationStatus(batch.expirationDate);

  return (
    <Container status={status}>
      <TouchableContent onPress={onPress}>
        <Header>
          <Title>{product.name}</Title>
          <StatusBadge status={status}>{statusLabel[status]}</StatusBadge>
        </Header>

        <Barcode>{product.barcode}</Barcode>

        <Footer>
          <CategoryName>{category.name}</CategoryName>
          <Value>Qtd: {batch.amount}</Value>
        </Footer>

        <Footer>
          <Label>Validade</Label>
          <Value>{formatISODate(batch.expirationDate)}</Value>
        </Footer>

        <Footer>
          <Label>Fabricação</Label>
          <Value>{formatISODate(batch.fabricationDate)}</Value>
        </Footer>
      </TouchableContent>

      <DeleteButton onPress={() => onDelete(batch.id)}>
        <DeleteText>Excluir lote</DeleteText>
      </DeleteButton>
    </Container>
  );
}

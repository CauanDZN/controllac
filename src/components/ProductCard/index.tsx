import React from 'react';

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
  Value,
} from './styles';

const statusLabel = {
  expired: 'Vencido',
  expiring: 'Vencendo em breve',
  ok: 'Dentro da validade',
};

interface Props {
  data: Product;
  onDelete: (id: string) => void;
}

export function ProductCard({data, onDelete}: Props) {
  const category = getCategory(data.category);
  const status = getExpirationStatus(data.expirationDate);

  return (
    <Container status={status}>
      <Header>
        <Title>{data.name}</Title>
        <StatusBadge status={status}>{statusLabel[status]}</StatusBadge>
      </Header>

      <Barcode>{data.barcode}</Barcode>

      <Footer>
        <CategoryName>{category.name}</CategoryName>
        <Value>Qtd: {data.amount}</Value>
      </Footer>

      <Footer>
        <Label>Validade</Label>
        <Value>{formatISODate(data.expirationDate)}</Value>
      </Footer>

      <Footer>
        <Label>Fabricação</Label>
        <Value>{formatISODate(data.fabricationDate)}</Value>
      </Footer>

      <DeleteButton onPress={() => onDelete(data.id)}>
        <DeleteText>Excluir</DeleteText>
      </DeleteButton>
    </Container>
  );
}

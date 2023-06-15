import React from 'react';
import {Text, TouchableOpacity} from 'react-native';

import {categories} from '../../utils/categories';

import {
  Container,
  Title,
  Amount,
  Footer,
  Category,
  CategoryName,
  ValidationText,
  ExpirationText,
  Date,
} from './styles';

export interface TransactionCardProps {
  name: string;
  barcode: string;
  expiration: string;
  fabrication: string;
  amount: string;
  category: string;
  date: string;
}

interface Props {
  data: TransactionCardProps;
  onDelete: (id: string) => void;
}

export function TransactionCard({data, onDelete}: Props) {
  const handleDelete = () => {
    onDelete(data.id);
  };
  const [category] = categories.filter(item => item.key === data.category);

  return (
    <Container>
      <Title>{data.name}</Title>

      <Amount>{data.barcode}</Amount>

      <Footer>
        <CategoryName>{category.name}</CategoryName>
      </Footer>

      <Footer>
        <ValidationText>Quantidades:</ValidationText>

        <Date>{data.amount}</Date>
      </Footer>

      <Footer>
        <ValidationText>Data de Validade:</ValidationText>

        <Date>{data.expiration}</Date>
      </Footer>

      <Footer>
        <ExpirationText>Data de Fabricação:</ExpirationText>

        <Date>{data.fabrication}</Date>
      </Footer>

      <Footer>
        <TouchableOpacity onPress={handleDelete}>
          <Text style={{color: 'red'}}>DELETAR</Text>
        </TouchableOpacity>
      </Footer>
    </Container>
  );
}

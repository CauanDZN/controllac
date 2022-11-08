import React from 'react';

import { categories } from '../../utils/categories';

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
  category: string;
  date: string;
}

interface Props {
  data: TransactionCardProps;
}

export function TransactionCard({ data }: Props) {
  const [category] = categories.filter(
    item => item.key === data.category
  );

  console.log(data);
  return (
    <Container>
      <Title>
        {data.name}
      </Title>

      <Amount>
        {data.barcode}
      </Amount>

      <Footer>
        <CategoryName>
          {category.name}
        </CategoryName>
      </Footer>

      <Footer>
        <ValidationText>
          Data de Validade:
        </ValidationText>

        <Date>
          {data.expiration}
        </Date>
      </Footer>

      <Footer>
        <ExpirationText>
          Data de Fabricação:
        </ExpirationText>

        <Date>
          {data.fabrication}
        </Date>
      </Footer>
    </Container>
  )
}
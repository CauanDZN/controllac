import React from 'react';

import {
  Container,
  Title,
  Amount,
} from './styles';

interface Props {
  title: string;
}

export function HistoryCard({
  title
}: Props) {
  return (
    <Container>
      <Title>{title}</Title>
    </Container>
  );
}
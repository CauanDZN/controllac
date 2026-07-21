import React from 'react';

import {Button} from '@/components/Button';

import {Container, Icon, Text} from './styles';

interface Props {
  onRetry: () => void;
}

export function LoadError({onRetry}: Props) {
  return (
    <Container>
      <Icon name="alert-circle-outline" />
      <Text>Não foi possível carregar seus dados</Text>
      <Button title="Tentar novamente" onPress={onRetry} />
    </Container>
  );
}

import React from 'react';

import {Container, Icon, Input} from './styles';

interface Props {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
}

export function SearchInput({value, onChangeText, placeholder}: Props) {
  return (
    <Container>
      <Icon name="search" />
      <Input
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        autoCorrect={false}
      />
    </Container>
  );
}

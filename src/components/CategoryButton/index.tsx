import React from 'react';
import {RectButtonProps} from 'react-native-gesture-handler';

import {Category} from '@/utils/categories';

import {
  Category as CategoryText,
  Container,
  Content,
  Dot,
  Icon,
} from './styles';

interface Props extends RectButtonProps {
  category?: Category;
  onPress: () => void;
}

export function CategoryButton({category, onPress, ...rest}: Props) {
  return (
    <Container onPress={onPress} {...rest}>
      <Content>
        {category && <Dot color={category.color} />}
        <CategoryText isPlaceholder={!category}>
          {category ? category.name : 'Selecione a categoria'}
        </CategoryText>
      </Content>

      <Icon name="chevron-right" />
    </Container>
  );
}

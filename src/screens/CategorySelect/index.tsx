import React from 'react';
import {FlatList} from 'react-native';

import {Button} from '@/components/Button';
import {Category as CategoryType, categories} from '@/utils/categories';

import {
  Category,
  CategoryInfo,
  CheckIcon,
  Container,
  Dot,
  Footer,
  Header,
  Name,
  Separator,
  Title,
} from './styles';

interface Props {
  selectedCategory?: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
  onClose: () => void;
}

export function CategorySelect({
  selectedCategory,
  onSelectCategory,
  onClose,
}: Props) {
  return (
    <Container>
      <Header>
        <Title>Categoria</Title>
      </Header>

      <FlatList
        data={categories}
        style={{flex: 1, width: '100%'}}
        keyExtractor={item => item.key}
        renderItem={({item}) => {
          const isActive = selectedCategory?.key === item.key;

          return (
            <Category
              onPress={() => onSelectCategory(item)}
              isActive={isActive}>
              <CategoryInfo>
                <Dot color={item.color} />
                <Name>{item.name}</Name>
              </CategoryInfo>

              {isActive && <CheckIcon name="check" />}
            </Category>
          );
        }}
        ItemSeparatorComponent={() => <Separator />}
      />

      <Footer>
        <Button title="Selecionar" onPress={onClose} />
      </Footer>
    </Container>
  );
}

import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {yupResolver} from '@hookform/resolvers/yup';
import {useForm} from 'react-hook-form';
import {useTheme} from 'styled-components';
import * as yup from 'yup';

import {Button} from '@/components/Button';
import {CategoryButton} from '@/components/CategoryButton';
import {InputForm} from '@/components/InputForm';
import {RootStackParamList} from '@/routes/types';
import {batchesStorage} from '@/storage/batchesStorage';
import {productsStorage} from '@/storage/productsStorage';
import {Category, getCategory} from '@/utils/categories';

import {CategorySelect} from '../CategorySelect';
import {
  CloseButton,
  CloseIcon,
  Container,
  DeleteButton,
  DeleteText,
  Fields,
  Form,
  Header,
  LoadContainer,
  Title,
} from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'ProdutoForm'>;

interface FormData {
  name: string;
  barcode: string;
  minimumStock: string;
}

const schema = yup.object({
  name: yup.string().required('O nome é obrigatório'),
  barcode: yup.string().required('O código de barras é obrigatório'),
  minimumStock: yup.string().default(''),
});

export function ProdutoForm({navigation, route}: Props) {
  const {productId, barcode, chainToLote} = route.params ?? {};
  const isEditing = !!productId;

  const [isLoading, setIsLoading] = useState(isEditing);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>();

  const theme = useTheme();

  const {
    control,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {barcode: barcode ?? '', minimumStock: ''},
  });

  useEffect(() => {
    if (!productId) {
      return;
    }

    productsStorage.getAll().then(products => {
      const product = products.find(item => item.id === productId);

      if (product) {
        reset({
          name: product.name,
          barcode: product.barcode,
          minimumStock:
            product.minimumStock != null ? String(product.minimumStock) : '',
        });
        setSelectedCategory(getCategory(product.category));
      }

      setIsLoading(false);
    });
  }, [productId, reset]);

  async function handleSave(form: FormData) {
    if (!selectedCategory) {
      Alert.alert('Selecione a categoria!');
      return;
    }

    const minimumStock = form.minimumStock.trim()
      ? Number(form.minimumStock)
      : undefined;

    try {
      const input = {
        name: form.name,
        barcode: form.barcode,
        category: selectedCategory.key,
        minimumStock,
      };

      const product = isEditing
        ? await productsStorage.update(productId, input)
        : await productsStorage.add(input);

      if (chainToLote) {
        navigation.replace('LoteForm', {productId: product.id});
      } else {
        navigation.goBack();
      }
    } catch {
      Alert.alert('Não foi possível salvar o produto');
    }
  }

  async function handleDelete() {
    if (!productId) {
      return;
    }

    const batches = await batchesStorage.getByProductId(productId);
    const message =
      batches.length > 0
        ? `Isso também vai excluir ${batches.length} lote${batches.length !== 1 ? 's' : ''} cadastrado${
            batches.length !== 1 ? 's' : ''
          } desse produto. Continuar?`
        : 'Tem certeza que deseja excluir este produto?';

    Alert.alert('Excluir produto', message, [
      {text: 'Cancelar', style: 'cancel'},
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await batchesStorage.removeByProductId(productId);
          await productsStorage.remove(productId);
          navigation.goBack();
        },
      },
    ]);
  }

  if (isLoading) {
    return (
      <Container>
        <LoadContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadContainer>
      </Container>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>{isEditing ? 'Editar produto' : 'Novo produto'}</Title>

          <CloseButton onPress={() => navigation.goBack()}>
            <CloseIcon name="x" />
          </CloseButton>
        </Header>

        <ScrollView>
          <Form>
            <Fields>
              <InputForm
                name="name"
                control={control}
                placeholder="Nome do produto"
                autoCorrect={false}
                error={errors.name?.message}
              />

              <InputForm
                name="barcode"
                control={control}
                placeholder="Código de Barras"
                keyboardType="numeric"
                error={errors.barcode?.message}
              />

              <CategoryButton
                category={selectedCategory}
                onPress={() => setCategoryModalOpen(true)}
              />

              <InputForm
                name="minimumStock"
                control={control}
                placeholder="Estoque mínimo (opcional)"
                keyboardType="numeric"
                error={errors.minimumStock?.message}
              />
            </Fields>

            <Button title="Salvar" onPress={handleSubmit(handleSave)} />

            {isEditing && (
              <DeleteButton onPress={handleDelete}>
                <DeleteText>Excluir produto</DeleteText>
              </DeleteButton>
            )}
          </Form>
        </ScrollView>

        <Modal visible={categoryModalOpen}>
          <CategorySelect
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onClose={() => setCategoryModalOpen(false)}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  );
}

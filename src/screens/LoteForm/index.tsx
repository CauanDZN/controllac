import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {yupResolver} from '@hookform/resolvers/yup';
import {useForm} from 'react-hook-form';
import {useTheme} from 'styled-components';
import * as yup from 'yup';

import {Button} from '@/components/Button';
import {InputForm} from '@/components/InputForm';
import {RootStackParamList} from '@/routes/types';
import {batchesStorage} from '@/storage/batchesStorage';
import {productsStorage} from '@/storage/productsStorage';
import {Batch} from '@/types/batch';
import {Product} from '@/types/product';
import {getCategory} from '@/utils/categories';
import {formatISODate, isValidMaskedDate, maskedDateToISO} from '@/utils/date';

import {
  CloseButton,
  CloseIcon,
  Container,
  Fields,
  Form,
  Header,
  LoadContainer,
  ProductDot,
  ProductInfo,
  ProductMeta,
  ProductName,
  ProductSummary,
  Title,
} from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'LoteForm'>;

interface FormData {
  amount: string;
  supplier: string;
  fabricationDate: string;
  expirationDate: string;
}

const schema = yup.object({
  amount: yup.string().required('A quantidade é obrigatória'),
  supplier: yup.string().required('O fornecedor é obrigatório'),
  fabricationDate: yup
    .string()
    .required('A data de fabricação é obrigatória')
    .test('valid-date', 'Data inválida', isValidMaskedDate),
  expirationDate: yup
    .string()
    .required('A data de validade é obrigatória')
    .test('valid-date', 'Data inválida', isValidMaskedDate),
});

export function LoteForm({navigation, route}: Props) {
  const {batchId, productId} = route.params ?? {};
  const isEditing = !!batchId;

  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<Product>();
  const [batch, setBatch] = useState<Batch>();

  const theme = useTheme();

  const {
    control,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm<FormData>({resolver: yupResolver(schema)});

  const loadData = useCallback(async () => {
    const products = await productsStorage.getAll();
    let existingBatch: Batch | undefined;
    let resolvedProductId = productId;

    if (batchId) {
      const batches = await batchesStorage.getAll();
      existingBatch = batches.find(item => item.id === batchId);
      resolvedProductId = existingBatch?.productId;
    }

    const resolvedProduct = products.find(
      item => item.id === resolvedProductId,
    );

    if (!resolvedProduct) {
      Alert.alert('Produto não encontrado');
      navigation.goBack();
      return;
    }

    setProduct(resolvedProduct);
    setBatch(existingBatch);

    if (existingBatch) {
      reset({
        amount: existingBatch.amount,
        supplier: existingBatch.supplier,
        fabricationDate: formatISODate(existingBatch.fabricationDate),
        expirationDate: formatISODate(existingBatch.expirationDate),
      });
    }

    setIsLoading(false);
  }, [batchId, productId, navigation, reset]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time async load on mount, not a render loop
    loadData();
  }, [loadData]);

  async function handleSave(form: FormData) {
    if (!product) {
      return;
    }

    const input = {
      productId: product.id,
      amount: form.amount,
      supplier: form.supplier,
      fabricationDate: maskedDateToISO(form.fabricationDate),
      expirationDate: maskedDateToISO(form.expirationDate),
    };

    try {
      if (isEditing && batch) {
        await batchesStorage.update(batch.id, input, product.name);
      } else {
        await batchesStorage.add(input, product.name);
      }

      navigation.navigate('Tabs', {screen: 'Lotes'});
    } catch {
      Alert.alert('Não foi possível salvar o lote');
    }
  }

  if (isLoading || !product) {
    return (
      <Container>
        <LoadContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadContainer>
      </Container>
    );
  }

  const category = getCategory(product.category);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>{isEditing ? 'Editar lote' : 'Novo lote'}</Title>

          <CloseButton onPress={() => navigation.goBack()}>
            <CloseIcon name="x" />
          </CloseButton>
        </Header>

        <ScrollView>
          <Form>
            <Fields>
              <ProductSummary>
                <ProductDot color={category.color} />
                <ProductInfo>
                  <ProductName>{product.name}</ProductName>
                  <ProductMeta>
                    {category.name} · {product.barcode}
                  </ProductMeta>
                </ProductInfo>
              </ProductSummary>

              <InputForm
                name="amount"
                control={control}
                placeholder="Quantidade"
                keyboardType="numeric"
                error={errors.amount?.message}
              />

              <InputForm
                name="supplier"
                control={control}
                placeholder="Fornecedor"
                error={errors.supplier?.message}
              />

              <InputForm
                name="fabricationDate"
                control={control}
                placeholder="Data de Fabricação"
                keyboardType="numeric"
                isDateField
                error={errors.fabricationDate?.message}
              />

              <InputForm
                name="expirationDate"
                control={control}
                placeholder="Data de Validade"
                keyboardType="numeric"
                isDateField
                error={errors.expirationDate?.message}
              />
            </Fields>

            <Button title="Salvar" onPress={handleSubmit(handleSave)} />
          </Form>
        </ScrollView>
      </Container>
    </TouchableWithoutFeedback>
  );
}

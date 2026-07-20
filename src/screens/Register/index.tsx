import React, {useEffect, useState} from 'react';
import {
  Alert,
  Keyboard,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {yupResolver} from '@hookform/resolvers/yup';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';

import {Button} from '@/components/Button';
import {CategoryButton} from '@/components/CategoryButton';
import {InputForm} from '@/components/InputForm';
import {AppTabParamList} from '@/routes/types';
import {productsStorage} from '@/storage/productsStorage';
import {Category} from '@/utils/categories';
import {isValidMaskedDate, maskedDateToISO} from '@/utils/date';

import {CategorySelect} from '../CategorySelect';
import {Container, Fields, Form, Header, Title} from './styles';

type Props = BottomTabScreenProps<AppTabParamList, 'Cadastrar'>;

interface FormData {
  name: string;
  barcode: string;
  fabricationDate: string;
  expirationDate: string;
  amount: string;
  supplier: string;
}

const schema = yup.object({
  barcode: yup.string().required('O código de barras é obrigatório'),
  name: yup.string().required('O nome é obrigatório'),
  fabricationDate: yup
    .string()
    .required('A data de fabricação é obrigatória')
    .test('valid-date', 'Data inválida', isValidMaskedDate),
  expirationDate: yup
    .string()
    .required('A data de validade é obrigatória')
    .test('valid-date', 'Data inválida', isValidMaskedDate),
  amount: yup.string().required('A quantidade é obrigatória'),
  supplier: yup.string().required('O fornecedor é obrigatório'),
});

export function Register({navigation, route}: Props) {
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: {errors},
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      barcode: route.params?.barcode ?? '',
    },
  });

  useEffect(() => {
    if (route.params?.barcode) {
      setValue('barcode', route.params.barcode);
    }
  }, [route.params?.barcode, setValue]);

  async function handleRegister(form: FormData) {
    if (!selectedCategory) {
      Alert.alert('Selecione a categoria!');
      return;
    }

    try {
      await productsStorage.add({
        name: form.name,
        barcode: form.barcode,
        category: selectedCategory.key,
        amount: form.amount,
        supplier: form.supplier,
        fabricationDate: maskedDateToISO(form.fabricationDate),
        expirationDate: maskedDateToISO(form.expirationDate),
      });

      reset({barcode: ''});
      setSelectedCategory(undefined);

      navigation.navigate('Listagem');
    } catch {
      Alert.alert('Não foi possível salvar o produto');
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>

        <ScrollView>
          <Form>
            <Fields>
              <InputForm
                name="barcode"
                control={control}
                placeholder="Código de Barras"
                keyboardType="numeric"
                error={errors.barcode?.message}
              />

              <InputForm
                name="name"
                control={control}
                placeholder="Nome"
                autoCorrect={false}
                error={errors.name?.message}
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

              <CategoryButton
                category={selectedCategory}
                onPress={() => setCategoryModalOpen(true)}
              />
            </Fields>

            <Button title="Salvar" onPress={handleSubmit(handleRegister)} />
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

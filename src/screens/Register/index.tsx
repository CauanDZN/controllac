import React, {useState} from 'react';
import {
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Button,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import * as Yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {uuid} from 'uuid-random';
import {useForm} from 'react-hook-form';
import {format} from 'date-fns';

import {InputForm} from '../../components/Form/InputForm';
import {CategorySelectButton} from '../../components/Form/CategorySelectButton';
import {useAuth} from '../../hooks/auth';
import {CategorySelect} from '../CategorySelect';
import {Container, Header, Title, Form, Fields, Date} from './styles';

interface FormData {
  name: string;
  barcode: string;
  expiration: string;
  fabrication: string;
  supplier: string;
  amount: string;
}

const schema = Yup.object().shape({
  name: Yup.string().required('O nome é obrigatório'),
  expiration: Yup.string().required('A data de validade é obrigatória'),
  fabrication: Yup.string().required('A data de fabricação é obrigatória'),
  supplier: Yup.string().required('O CNPJ do Fornecedor é obrigatório'),
  amount: Yup.number().required('A quantidade de lotes é obrigatória'),
  barcode: Yup.string()
    .typeError('Informe o código de barras')
    .required('O código de barras é obrigatório'),
});

export function Register({navigation, route}) {
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [modalVisible, setModalVisisble] = useState(false);

  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria',
  });

  const {barcode} = route.params || {};

  const {
    control,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      barcode: barcode || '', // Preencha o campo com o valor do código de barras ou uma string vazia
    },
  });

  function handleOpenSelectCategoryModal() {
    setCategoryModalOpen(true);
  }

  function handleCloseSelectCategoryModal() {
    setCategoryModalOpen(false);
  }

  async function handleRegister(form: FormData) {
    if (category.key === 'category') {
      return Alert.alert('Selecione a categoria!');
    }

    const newTransaction = {
      name: form.name,
      barcode: form.barcode,
      expiration: form.expiration,
      fabrication: form.fabrication,
      supplier: form.supplier,
      amount: form.amount,
      category: category.key,
    };

    try {
      const dataKey = '@controllac:transactions';
      const data = await AsyncStorage.getItem(dataKey);
      const currentData = data ? JSON.parse(data) : [];

      const dataFormatted = [...currentData, newTransaction];

      await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));

      reset();
      setCategory({
        key: 'category',
        name: 'Categoria',
      });

      navigation.navigate('Listagem');
    } catch (error) {
      console.log(error);
      Alert.alert('Não foi possível salvar');
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
                error={errors.barcode && errors.barcode.message}
              />

              <InputForm
                name="name"
                control={control}
                placeholder="Nome"
                autoCorrect={false}
                error={errors.name && errors.name.message}
              />

              <InputForm
                name="fabrication"
                control={control}
                placeholder="Data de Fabricação"
                error={errors.fabrication && errors.fabrication.message}
              />

              <InputForm
                name="expiration"
                control={control}
                placeholder="Data de Validade"
                error={errors.expiration && errors.expiration.message}
              />

              <InputForm
                name="amount"
                control={control}
                placeholder="Quantidade"
                keyboardType="numeric"
                error={errors.amount && errors.amount.message}
              />

              <InputForm
                name="supplier"
                control={control}
                placeholder="CNPJ do Fornecedor"
                error={errors.supplier && errors.supplier.message}
              />

              <Button
                title={category.name}
                onPress={handleOpenSelectCategoryModal}
              />
            </Fields>

            <Button title="Enviar" onPress={handleSubmit(handleRegister)} />
          </Form>
        </ScrollView>

        <Modal visible={categoryModalOpen}>
          <CategorySelect
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handleCloseSelectCategoryModal}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  );
}

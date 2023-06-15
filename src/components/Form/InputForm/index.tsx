import React from 'react';
import {TextInputProps} from 'react-native';
import {Control, Controller} from 'react-hook-form';

import {Input} from '../Input';

import {Container, Error} from './styles';

interface Props extends TextInputProps {
  control: Control;
  name: string;
  error: string;
}

export function InputForm({control, name, error, ...rest}: Props) {
  const isDateField = name === 'fabrication' || name === 'expiration';

  const formatValue = (value: string) => {
    if (isDateField) {
      // Remove caracteres não numéricos da entrada do usuário
      const numericValue = value.replace(/\D/g, '');

      if (numericValue.length > 2) {
        // Insere barras entre os números
        const formattedValue = `${numericValue.slice(
          0,
          2,
        )}/${numericValue.slice(2, 4)}/${numericValue.slice(4)}`;
        return formattedValue;
      } else {
        return numericValue;
      }
    }

    return value;
  };

  return (
    <Container>
      <Controller
        control={control}
        render={({field: {onChange, value}}) => (
          <Input
            onChangeText={text => onChange(formatValue(text))}
            defaultValue={value} // Altere 'value' para 'defaultValue'
            {...rest}
          />
        )}
        name={name}
      />
      {error && <Error>{error}</Error>}
    </Container>
  );
}

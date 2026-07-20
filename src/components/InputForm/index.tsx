import React from 'react';
import {TextInputProps} from 'react-native';
import {Control, Controller, FieldValues, Path} from 'react-hook-form';

import {Input} from '@/components/Input';
import {maskDate} from '@/utils/date';

import {Container, Error} from './styles';

interface Props<TFieldValues extends FieldValues> extends TextInputProps {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  error?: string;
  isDateField?: boolean;
}

export function InputForm<TFieldValues extends FieldValues>({
  control,
  name,
  error,
  isDateField,
  ...rest
}: Props<TFieldValues>) {
  return (
    <Container>
      <Controller
        control={control}
        name={name}
        render={({field: {onChange, value}}) => (
          <Input
            onChangeText={text => onChange(isDateField ? maskDate(text) : text)}
            value={value}
            {...rest}
          />
        )}
      />
      {error && <Error>{error}</Error>}
    </Container>
  );
}

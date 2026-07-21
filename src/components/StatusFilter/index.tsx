import React from 'react';

import {ExpirationStatus} from '@/utils/date';

import {Chip, ChipText, Container} from './styles';

export type StatusFilterValue = ExpirationStatus | 'all';

const options: {value: StatusFilterValue; label: string}[] = [
  {value: 'all', label: 'Todos'},
  {value: 'expired', label: 'Vencido'},
  {value: 'expiring', label: 'Vencendo'},
  {value: 'ok', label: 'Ok'},
];

interface Props {
  value: StatusFilterValue;
  onChange: (value: StatusFilterValue) => void;
}

export function StatusFilter({value, onChange}: Props) {
  return (
    <Container>
      {options.map(option => (
        <Chip
          key={option.value}
          isActive={value === option.value}
          onPress={() => onChange(option.value)}>
          <ChipText isActive={value === option.value}>{option.label}</ChipText>
        </Chip>
      ))}
    </Container>
  );
}

import styled from 'styled-components/native';
import {Feather} from '@expo/vector-icons';
import {RFValue} from 'react-native-responsive-fontsize';

export const Container = styled.View`
  flex-direction: row;
  align-items: center;

  background-color: ${({theme}) => theme.colors.shape};
  border-radius: 5px;
  padding: 0 16px;

  margin-bottom: 16px;
`;

export const Icon = styled(Feather)`
  font-size: ${RFValue(18)}px;
  color: ${({theme}) => theme.colors.text};
  margin-right: 8px;
`;

export const Input = styled.TextInput`
  flex: 1;
  padding: 14px 0;

  font-family: ${({theme}) => theme.fonts.regular};
  font-size: ${RFValue(14)}px;
  color: ${({theme}) => theme.colors.text_dark};
`;

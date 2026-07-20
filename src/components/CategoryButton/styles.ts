import styled from 'styled-components/native';
import {RectButton} from 'react-native-gesture-handler';
import {Feather} from '@expo/vector-icons';
import {RFValue} from 'react-native-responsive-fontsize';

export const Container = styled(RectButton)`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  background-color: ${({theme}) => theme.colors.shape};
  border-radius: 5px;
  padding: 18px;

  margin-bottom: 8px;
`;

export const Content = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const Dot = styled.View<{color: string}>`
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: ${({color}) => color};
  margin-right: 12px;
`;

export const Category = styled.Text<{isPlaceholder: boolean}>`
  font-family: ${({theme}) => theme.fonts.regular};
  font-size: ${RFValue(14)}px;
  color: ${({theme, isPlaceholder}) => (isPlaceholder ? theme.colors.text : theme.colors.text_dark)};
`;

export const Icon = styled(Feather)`
  font-size: ${RFValue(20)}px;
  color: ${({theme}) => theme.colors.text};
`;

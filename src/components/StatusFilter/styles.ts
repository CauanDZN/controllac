import styled from 'styled-components/native';
import {RFValue} from 'react-native-responsive-fontsize';

export const Container = styled.View`
  flex-direction: row;
  margin-bottom: 16px;
`;

export const Chip = styled.TouchableOpacity<{isActive: boolean}>`
  padding: 8px 14px;
  border-radius: 20px;
  margin-right: 8px;

  background-color: ${({theme, isActive}) => (isActive ? theme.colors.secondary : theme.colors.shape)};
`;

export const ChipText = styled.Text<{isActive: boolean}>`
  font-family: ${({theme}) => theme.fonts.medium};
  font-size: ${RFValue(12)}px;
  color: ${({theme, isActive}) => (isActive ? theme.colors.shape : theme.colors.text)};
`;

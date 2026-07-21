import styled from 'styled-components/native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {RFValue} from 'react-native-responsive-fontsize';

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 32px;
`;

export const Icon = styled(MaterialCommunityIcons)`
  font-size: ${RFValue(48)}px;
  color: ${({theme}) => theme.colors.attention};
  margin-bottom: 16px;
`;

export const Text = styled.Text`
  font-family: ${({theme}) => theme.fonts.medium};
  font-size: ${RFValue(16)}px;
  color: ${({theme}) => theme.colors.text_dark};
  text-align: center;
  margin-bottom: 16px;
`;

import styled from 'styled-components/native';
import {Feather} from '@expo/vector-icons';
import {RFValue} from 'react-native-responsive-fontsize';

export const Container = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  background-color: ${({theme}) => theme.colors.shape};
  border-radius: 5px;
  padding: 16px 18px;

  margin-bottom: 8px;
`;

export const Info = styled.View`
  flex: 1;
`;

export const NameRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const Dot = styled.View<{color: string}>`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: ${({color}) => color};
  margin-right: 8px;
`;

export const Name = styled.Text`
  font-family: ${({theme}) => theme.fonts.medium};
  font-size: ${RFValue(14)}px;
  color: ${({theme}) => theme.colors.text_dark};
`;

export const Barcode = styled.Text`
  font-family: ${({theme}) => theme.fonts.regular};
  font-size: ${RFValue(12)}px;
  color: ${({theme}) => theme.colors.text};
  margin-top: 2px;
  margin-left: 18px;
`;

export const LowStockBadge = styled.Text`
  font-family: ${({theme}) => theme.fonts.medium};
  font-size: ${RFValue(11)}px;
  color: ${({theme}) => theme.colors.attention};
  margin-top: 2px;
  margin-left: 18px;
`;

export const Icon = styled(Feather)`
  font-size: ${RFValue(20)}px;
  color: ${({theme}) => theme.colors.text};
`;

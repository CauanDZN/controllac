import styled from 'styled-components/native';
import {Feather} from '@expo/vector-icons';
import {RFValue} from 'react-native-responsive-fontsize';

export const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.colors.background};
`;

export const Header = styled.View`
  background-color: ${({theme}) => theme.colors.primary};

  width: 100%;
  height: ${RFValue(113)}px;

  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px 19px;
`;

export const Title = styled.Text`
  font-family: ${({theme}) => theme.fonts.regular};
  font-size: ${RFValue(18)}px;
  color: ${({theme}) => theme.colors.shape};
`;

export const CloseButton = styled.TouchableOpacity``;

export const CloseIcon = styled(Feather)`
  font-size: ${RFValue(24)}px;
  color: ${({theme}) => theme.colors.shape};
`;

export const Form = styled.View`
  flex: 1;
  justify-content: space-between;
  width: 100%;

  padding: 24px;
`;

export const Fields = styled.View``;

export const ProductSummary = styled.View`
  flex-direction: row;
  align-items: center;

  background-color: ${({theme}) => theme.colors.shape};
  border-radius: 5px;
  padding: 16px 18px;

  margin-bottom: 16px;
`;

export const ProductDot = styled.View<{color: string}>`
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: ${({color}) => color};
  margin-right: 12px;
`;

export const ProductInfo = styled.View``;

export const ProductName = styled.Text`
  font-family: ${({theme}) => theme.fonts.medium};
  font-size: ${RFValue(14)}px;
  color: ${({theme}) => theme.colors.text_dark};
`;

export const ProductMeta = styled.Text`
  font-family: ${({theme}) => theme.fonts.regular};
  font-size: ${RFValue(12)}px;
  color: ${({theme}) => theme.colors.text};
  margin-top: 2px;
`;

export const LoadContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

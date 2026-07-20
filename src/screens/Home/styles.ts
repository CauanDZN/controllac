import styled from 'styled-components/native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';

export const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.colors.background};
`;

export const Header = styled.View<{topInset: number}>`
  width: 100%;
  padding: ${({topInset}) => topInset + RFValue(24)}px 24px ${RFValue(24)}px;

  background-color: ${({theme}) => theme.colors.primary};
`;

export const Title = styled.Text`
  color: ${({theme}) => theme.colors.shape};
  font-size: ${RFValue(22)}px;
  font-family: ${({theme}) => theme.fonts.bold};
`;

export const Subtitle = styled.Text`
  color: ${({theme}) => theme.colors.shape};
  font-size: ${RFValue(14)}px;
  font-family: ${({theme}) => theme.fonts.regular};
  margin-top: 4px;
`;

export const productListStyle = {
  flex: 1,
};

export const productListContentContainerStyle = {
  paddingHorizontal: 24,
  paddingTop: RFPercentage(4),
};

export const LoadContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const EmptyContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 32px;
  margin-top: -${RFPercentage(10)}px;
`;

export const EmptyIcon = styled(MaterialCommunityIcons)`
  font-size: ${RFValue(48)}px;
  color: ${({theme}) => theme.colors.text};
  margin-bottom: 16px;
`;

export const EmptyText = styled.Text`
  font-family: ${({theme}) => theme.fonts.medium};
  font-size: ${RFValue(16)}px;
  color: ${({theme}) => theme.colors.text_dark};
  text-align: center;
`;

export const EmptySubtext = styled.Text`
  font-family: ${({theme}) => theme.fonts.regular};
  font-size: ${RFValue(14)}px;
  color: ${({theme}) => theme.colors.text};
  text-align: center;
  margin-top: 4px;
`;

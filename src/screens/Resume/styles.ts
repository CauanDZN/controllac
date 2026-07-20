import styled from 'styled-components/native';
import {RFValue} from 'react-native-responsive-fontsize';
import {Feather} from '@expo/vector-icons';

export const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.colors.background};
`;

export const Header = styled.View`
  background-color: ${({theme}) => theme.colors.primary};
  width: 100%;
  height: ${RFValue(113)}px;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 19px;
`;

export const Title = styled.Text`
  font-family: ${({theme}) => theme.fonts.regular};
  font-size: ${RFValue(18)}px;
  color: ${({theme}) => theme.colors.shape};
`;

export const Content = styled.ScrollView``;

export const ChartContainer = styled.View`
  width: 100%;
  align-items: center;
  margin-top: 16px;
`;

export const CenterLabel = styled.View`
  align-items: center;
  justify-content: center;
`;

export const CenterLabelValue = styled.Text`
  font-family: ${({theme}) => theme.fonts.bold};
  font-size: ${RFValue(20)}px;
  color: ${({theme}) => theme.colors.text_dark};
`;

export const CenterLabelText = styled.Text`
  font-family: ${({theme}) => theme.fonts.regular};
  font-size: ${RFValue(12)}px;
  color: ${({theme}) => theme.colors.text};
`;

export const MonthSelect = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
`;

export const MonthSelectButton = styled.TouchableOpacity`
  padding: 8px;
`;

export const MonthSelectIcon = styled(Feather)`
  font-size: ${RFValue(24)}px;
  color: ${({theme}) => theme.colors.text};
`;

export const Month = styled.Text`
  font-family: ${({theme}) => theme.fonts.regular};
  font-size: ${RFValue(18)}px;
  text-transform: capitalize;
`;

export const LoadContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const EmptyText = styled.Text`
  font-family: ${({theme}) => theme.fonts.regular};
  font-size: ${RFValue(14)}px;
  color: ${({theme}) => theme.colors.text};
  text-align: center;
  margin-top: 24px;
`;

export const HighlightText = styled.Text`
  font-family: ${({theme}) => theme.fonts.medium};
  font-size: ${RFValue(13)}px;
  color: ${({theme}) => theme.colors.text_dark};
  text-align: center;
  margin-top: 12px;
`;

export const CategoryList = styled.View`
  margin-top: 24px;
`;

export const CategoryRow = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  padding: 14px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${({theme}) => theme.colors.background};
`;

export const CategoryInfo = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const CategoryDot = styled.View<{color: string}>`
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: ${({color}) => color};
  margin-right: 12px;
`;

export const CategoryName = styled.Text`
  font-family: ${({theme}) => theme.fonts.regular};
  font-size: ${RFValue(14)}px;
  color: ${({theme}) => theme.colors.text_dark};
`;

export const CategoryCount = styled.Text`
  font-family: ${({theme}) => theme.fonts.medium};
  font-size: ${RFValue(14)}px;
  color: ${({theme}) => theme.colors.text};
`;

export const ModalContainer = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.colors.background};
`;

export const ModalHeader = styled.View<{color: string}>`
  background-color: ${({color}) => color};
  width: 100%;
  height: ${RFValue(113)}px;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 19px;
`;

export const ModalTitle = styled.Text`
  font-family: ${({theme}) => theme.fonts.bold};
  font-size: ${RFValue(18)}px;
  color: ${({theme}) => theme.colors.shape};
`;

export const ModalContent = styled.ScrollView.attrs({
  contentContainerStyle: {padding: 24},
})``;

export const ModalFooter = styled.View`
  padding: 24px;
`;

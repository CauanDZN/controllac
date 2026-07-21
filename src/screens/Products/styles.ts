import styled from 'styled-components/native';
import {Feather, MaterialCommunityIcons} from '@expo/vector-icons';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';

export const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.colors.background};
`;

export const Header = styled.View<{topInset: number}>`
  width: 100%;
  padding: ${({topInset}) => topInset + RFValue(24)}px 24px ${RFValue(24)}px;

  background-color: ${({theme}) => theme.colors.primary};

  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const HeaderInfo = styled.View``;

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

export const AddButton = styled.TouchableOpacity`
  width: ${RFValue(40)}px;
  height: ${RFValue(40)}px;
  border-radius: ${RFValue(20)}px;

  align-items: center;
  justify-content: center;

  background-color: ${({theme}) => theme.colors.secondary};
`;

export const AddIcon = styled(Feather)`
  font-size: ${RFValue(22)}px;
  color: ${({theme}) => theme.colors.shape};
`;

export const FiltersArea = styled.View`
  padding: ${RFPercentage(4)}px 24px 0;
`;

export const listStyle = {
  flex: 1,
};

export const listContentContainerStyle = {
  paddingHorizontal: 24,
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

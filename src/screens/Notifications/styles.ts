import styled from 'styled-components/native';
import {Feather, MaterialCommunityIcons} from '@expo/vector-icons';
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

export const listStyle = {
  flex: 1,
};

export const listContentContainerStyle = {
  padding: 24,
};

export const Item = styled.View`
  background-color: ${({theme}) => theme.colors.shape};
  border-radius: 5px;
  padding: 16px 18px;
  margin-bottom: 8px;
`;

export const ItemHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const ItemTitle = styled.Text`
  font-family: ${({theme}) => theme.fonts.medium};
  font-size: ${RFValue(14)}px;
  color: ${({theme}) => theme.colors.text_dark};
  flex: 1;
`;

export const ItemTime = styled.Text`
  font-family: ${({theme}) => theme.fonts.regular};
  font-size: ${RFValue(12)}px;
  color: ${({theme}) => theme.colors.text};
`;

export const ItemBody = styled.Text`
  font-family: ${({theme}) => theme.fonts.regular};
  font-size: ${RFValue(13)}px;
  color: ${({theme}) => theme.colors.text};
  margin-top: 4px;
`;

export const LoadContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const EmptyContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
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

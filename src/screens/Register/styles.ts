import styled from 'styled-components/native';
import {Feather} from '@expo/vector-icons';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';

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

export const Content = styled.View`
  flex: 1;
  padding: ${RFPercentage(4)}px 24px 0;
`;

export const NewProductButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;

  background-color: ${({theme}) => theme.colors.secondary};
  border-radius: 5px;
  padding: 16px;

  margin-bottom: 24px;
`;

export const NewProductIcon = styled(Feather)`
  font-size: ${RFValue(18)}px;
  color: ${({theme}) => theme.colors.shape};
  margin-right: 8px;
`;

export const NewProductText = styled.Text`
  font-family: ${({theme}) => theme.fonts.medium};
  font-size: ${RFValue(14)}px;
  color: ${({theme}) => theme.colors.shape};
`;

export const SectionLabel = styled.Text`
  font-family: ${({theme}) => theme.fonts.regular};
  font-size: ${RFValue(13)}px;
  color: ${({theme}) => theme.colors.text};
  margin-bottom: 12px;
`;

export const listStyle = {
  flex: 1,
};

export const listContentContainerStyle = {
  paddingBottom: 24,
};

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

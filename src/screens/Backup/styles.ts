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

export const Content = styled.View`
  flex: 1;
  padding: 24px;
`;

export const Section = styled.View`
  margin-bottom: 32px;
`;

export const SectionTitle = styled.Text`
  font-family: ${({theme}) => theme.fonts.medium};
  font-size: ${RFValue(16)}px;
  color: ${({theme}) => theme.colors.text_dark};
  margin-bottom: 8px;
`;

export const SectionText = styled.Text`
  font-family: ${({theme}) => theme.fonts.regular};
  font-size: ${RFValue(13)}px;
  color: ${({theme}) => theme.colors.text};
  line-height: ${RFValue(18)}px;
  margin-bottom: 16px;
`;

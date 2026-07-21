import styled from 'styled-components/native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {RFValue} from 'react-native-responsive-fontsize';

export const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.colors.background};
`;

export const SkipArea = styled.View`
  width: 100%;
  align-items: flex-end;
  padding: 16px 24px 0;
`;

export const SkipButton = styled.TouchableOpacity`
  padding: 8px;
`;

export const SkipText = styled.Text`
  font-family: ${({theme}) => theme.fonts.medium};
  font-size: ${RFValue(14)}px;
  color: ${({theme}) => theme.colors.text};
`;

export const Slide = styled.View<{width: number}>`
  width: ${({width}) => width}px;
  align-items: center;
  justify-content: center;
  padding: 32px;
`;

export const SlideIcon = styled(MaterialCommunityIcons)`
  font-size: ${RFValue(72)}px;
  color: ${({theme}) => theme.colors.primary};
  margin-bottom: 24px;
`;

export const SlideTitle = styled.Text`
  font-family: ${({theme}) => theme.fonts.bold};
  font-size: ${RFValue(20)}px;
  color: ${({theme}) => theme.colors.text_dark};
  text-align: center;
  margin-bottom: 12px;
`;

export const SlideText = styled.Text`
  font-family: ${({theme}) => theme.fonts.regular};
  font-size: ${RFValue(14)}px;
  color: ${({theme}) => theme.colors.text};
  text-align: center;
  line-height: ${RFValue(20)}px;
`;

export const Footer = styled.View`
  padding: 0 24px 24px;
`;

export const Dots = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-bottom: 24px;
`;

export const Dot = styled.View<{isActive: boolean}>`
  width: ${({isActive}) => (isActive ? RFValue(20) : RFValue(8))}px;
  height: ${RFValue(8)}px;
  border-radius: ${RFValue(4)}px;
  background-color: ${({theme, isActive}) => (isActive ? theme.colors.primary : theme.colors.text)};
  opacity: ${({isActive}) => (isActive ? 1 : 0.3)};
  margin: 0 4px;
`;

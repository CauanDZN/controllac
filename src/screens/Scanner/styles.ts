import styled from 'styled-components/native';
import {RFValue} from 'react-native-responsive-fontsize';

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

export const CenterContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 32px;
`;

export const InfoText = styled.Text`
  font-family: ${({theme}) => theme.fonts.regular};
  font-size: ${RFValue(14)}px;
  color: ${({theme}) => theme.colors.text_dark};
  text-align: center;
  margin-bottom: 16px;
`;

export const CameraArea = styled.View`
  flex: 1;
  margin: 24px;
  border-radius: 16px;
  overflow: hidden;
`;

export const ScannedPanel = styled.View`
  padding: 24px;
  background-color: ${({theme}) => theme.colors.shape};
`;

export const ScannedLabel = styled.Text`
  font-family: ${({theme}) => theme.fonts.regular};
  font-size: ${RFValue(13)}px;
  color: ${({theme}) => theme.colors.text};
`;

export const ScannedCode = styled.Text`
  font-family: ${({theme}) => theme.fonts.medium};
  font-size: ${RFValue(20)}px;
  color: ${({theme}) => theme.colors.text_dark};
  margin-top: 4px;
  margin-bottom: 16px;
`;

export const ActionsStack = styled.View`
  gap: 12px;
`;

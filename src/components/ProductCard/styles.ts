import styled from 'styled-components/native';
import {RFValue} from 'react-native-responsive-fontsize';

import {ExpirationStatus} from '@/utils/date';

const statusColor = {
  expired: 'attention',
  expiring: 'secondary',
  ok: 'success',
} as const;

export const Container = styled.View<{status: ExpirationStatus}>`
  background-color: ${({theme}) => theme.colors.shape};
  border-radius: 5px;
  border-left-width: 4px;
  border-left-color: ${({theme, status}) => theme.colors[statusColor[status]]};

  padding: 17px 24px;
  margin-bottom: 16px;
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
`;

export const Title = styled.Text`
  font-family: ${({theme}) => theme.fonts.medium};
  font-size: ${RFValue(16)}px;
  color: ${({theme}) => theme.colors.text_dark};
  flex: 1;
`;

export const StatusBadge = styled.Text<{status: ExpirationStatus}>`
  font-family: ${({theme}) => theme.fonts.medium};
  font-size: ${RFValue(11)}px;
  color: ${({theme, status}) => theme.colors[statusColor[status]]};
`;

export const Barcode = styled.Text`
  font-family: ${({theme}) => theme.fonts.regular};
  font-size: ${RFValue(12)}px;
  color: ${({theme}) => theme.colors.text};
  margin-top: 2px;
`;

export const Footer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  margin-top: 16px;
`;

export const CategoryName = styled.Text`
  color: ${({theme}) => theme.colors.text_dark};
  font-size: ${RFValue(14)}px;
`;

export const Label = styled.Text`
  font-size: ${RFValue(13)}px;
  color: ${({theme}) => theme.colors.text};
`;

export const Value = styled.Text`
  font-size: ${RFValue(13)}px;
  color: ${({theme}) => theme.colors.text_dark};
`;

export const DeleteButton = styled.TouchableOpacity`
  margin-top: 4px;
`;

export const DeleteText = styled.Text`
  font-family: ${({theme}) => theme.fonts.medium};
  font-size: ${RFValue(13)}px;
  color: ${({theme}) => theme.colors.attention};
`;

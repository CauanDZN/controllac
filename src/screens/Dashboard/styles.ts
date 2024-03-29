import styled from 'styled-components/native';
import {FlatList} from 'react-native';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import {getBottomSpace, getStatusBarHeight} from 'react-native-iphone-x-helper';
import {BorderlessButton} from 'react-native-gesture-handler';

import {DataListProps} from '.';

export const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.colors.background};
`;

export const Header = styled.View`
  width: 100%;
  height: ${RFPercentage(24)}px;

  background-color: ${({theme}) => theme.colors.primary};

  justify-content: center;
  align-items: flex-start;
  flex-direction: row;
`;

export const UserWrapper = styled.View`
  width: 100%;

  padding: 0 24px;
  margin-top: ${getStatusBarHeight() + RFValue(28)}px;

  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const UserInfo = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const Photo = styled.Image`
  width: ${RFValue(48)}px;
  height: ${RFValue(48)}px;

  border-radius: 10px;
`;

export const User = styled.View`
  margin-left: 17px;
`;

export const UserGreeting = styled.Text`
  color: ${({theme}) => theme.colors.shape};

  font-size: ${RFValue(18)}px;
  font-family: 'Inter-Medium';
`;

export const UserName = styled.Text`
  color: ${({theme}) => theme.colors.shape};

  font-size: ${RFValue(18)}px;
  font-family: 'Inter-Bold';
`;

export const LogoutButton = styled.TouchableOpacity``;

// export const Icon = styled(MaterialCommunityIcons)`
//   color: ${({ theme }) => theme.colors.secondary};
//   font-size: ${RFValue(24)}px;
// `;

export const Transactions = styled.View`
  flex: 1%;
  padding: 0 24px;

  margin-top: ${RFPercentage(4)}px;
`;

export const Title = styled.Text`
  font-size: ${RFValue(18)}px;
  font-family: 'Inter-Regular';

  margin-bottom: 16px;
`;

export const TransactionList = styled(
  FlatList as new () => FlatList<DataListProps>,
).attrs({
  showsVerticalScrollIndicator: false,
  contentContainerStyle: {
    paddingBottom: getBottomSpace(),
  },
})``;

export const LoadContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

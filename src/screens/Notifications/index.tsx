import React, {useCallback, useState} from 'react';
import {ActivityIndicator, FlatList} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {format, parseISO} from 'date-fns';
import {ptBR} from 'date-fns/locale';
import {useTheme} from 'styled-components';

import {LoadError} from '@/components/LoadError';
import {RootStackParamList} from '@/routes/types';
import {notificationLogStorage} from '@/storage/notificationLogStorage';
import {NotificationLogEntry} from '@/types/notificationLog';

import {
  CloseButton,
  CloseIcon,
  Container,
  EmptyContainer,
  EmptyIcon,
  EmptyText,
  Header,
  Item,
  ItemBody,
  ItemHeader,
  ItemTime,
  ItemTitle,
  listContentContainerStyle,
  listStyle,
  LoadContainer,
  Title,
} from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Notifications'>;

export function Notifications({navigation}: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [entries, setEntries] = useState<NotificationLogEntry[]>([]);

  const theme = useTheme();

  const loadEntries = useCallback(async () => {
    setHasError(false);

    try {
      const stored = await notificationLogStorage.getAll();
      setEntries(
        [...stored].sort((a, b) =>
          b.scheduledFor.localeCompare(a.scheduledFor),
        ),
      );
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [loadEntries]),
  );

  return (
    <Container>
      <Header>
        <Title>Notificações</Title>

        <CloseButton onPress={() => navigation.goBack()}>
          <CloseIcon name="x" />
        </CloseButton>
      </Header>

      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadContainer>
      ) : hasError ? (
        <LoadError onRetry={loadEntries} />
      ) : entries.length === 0 ? (
        <EmptyContainer>
          <EmptyIcon name="bell-outline" />
          <EmptyText>Nenhuma notificação ainda</EmptyText>
        </EmptyContainer>
      ) : (
        <FlatList
          data={entries}
          style={listStyle}
          contentContainerStyle={listContentContainerStyle}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <Item>
              <ItemHeader>
                <ItemTitle>{item.title}</ItemTitle>
                <ItemTime>
                  {format(parseISO(item.scheduledFor), "dd/MM 'às' HH:mm", {
                    locale: ptBR,
                  })}
                </ItemTime>
              </ItemHeader>
              <ItemBody>{item.body}</ItemBody>
            </Item>
          )}
        />
      )}
    </Container>
  );
}

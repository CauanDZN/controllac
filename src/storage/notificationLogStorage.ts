import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

import {
  NotificationLogEntry,
  NotificationLogEntryInput,
} from '@/types/notificationLog';

const STORAGE_KEY = '@controllac:notificationLog';

async function getAll(): Promise<NotificationLogEntry[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as NotificationLogEntry[]) : [];
}

async function persist(entries: NotificationLogEntry[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

async function add(
  input: NotificationLogEntryInput,
): Promise<NotificationLogEntry> {
  const entries = await getAll();

  const entry: NotificationLogEntry = {
    ...input,
    id: Crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  await persist([entry, ...entries]);

  return entry;
}

export const notificationLogStorage = {
  getAll,
  add,
};

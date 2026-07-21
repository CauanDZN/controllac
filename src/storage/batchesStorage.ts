import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

import {Batch, BatchInput} from '@/types/batch';
import {
  cancelReminder,
  scheduleExpirationReminder,
} from '@/utils/notifications';

const STORAGE_KEY = '@controllac:batches';

async function getAll(): Promise<Batch[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as Batch[]) : [];
}

async function persist(batches: Batch[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(batches));
}

async function getByProductId(productId: string): Promise<Batch[]> {
  const batches = await getAll();
  return batches.filter(batch => batch.productId === productId);
}

async function add(input: BatchInput, productName: string): Promise<Batch> {
  const batches = await getAll();

  const notificationId = await scheduleExpirationReminder({
    productName,
    expirationDateISO: input.expirationDate,
  });

  const batch: Batch = {
    ...input,
    id: Crypto.randomUUID(),
    notificationId,
    createdAt: new Date().toISOString(),
  };

  await persist([batch, ...batches]);

  return batch;
}

async function update(
  id: string,
  input: BatchInput,
  productName: string,
): Promise<Batch> {
  const batches = await getAll();
  const existing = batches.find(batch => batch.id === id);

  if (!existing) {
    throw new Error(`Batch ${id} not found`);
  }

  await cancelReminder(existing.notificationId);

  const notificationId = await scheduleExpirationReminder({
    productName,
    expirationDateISO: input.expirationDate,
  });

  const updated: Batch = {...existing, ...input, notificationId};

  await persist(batches.map(batch => (batch.id === id ? updated : batch)));

  return updated;
}

async function remove(id: string): Promise<void> {
  const batches = await getAll();
  const existing = batches.find(batch => batch.id === id);

  await cancelReminder(existing?.notificationId);
  await persist(batches.filter(batch => batch.id !== id));
}

async function removeByProductId(productId: string): Promise<void> {
  const batches = await getAll();
  const toRemove = batches.filter(batch => batch.productId === productId);

  await Promise.all(
    toRemove.map(batch => cancelReminder(batch.notificationId)),
  );
  await persist(batches.filter(batch => batch.productId !== productId));
}

export const batchesStorage = {
  getAll,
  getByProductId,
  add,
  update,
  remove,
  removeByProductId,
};

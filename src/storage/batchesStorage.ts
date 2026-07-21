import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

import {movementsStorage} from '@/storage/movementsStorage';
import {Batch, BatchInput} from '@/types/batch';
import {MovementType} from '@/types/movement';
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

interface RemovedBatchProduct {
  name: string;
  category: string;
}

async function remove(
  id: string,
  type: MovementType,
  product: RemovedBatchProduct,
): Promise<void> {
  const batches = await getAll();
  const existing = batches.find(batch => batch.id === id);

  if (existing) {
    await movementsStorage.add({
      productId: existing.productId,
      productName: product.name,
      category: product.category,
      type,
      amount: existing.amount,
      costPrice: existing.costPrice,
      salePrice: existing.salePrice,
    });
  }

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

async function restore(
  batches: Batch[],
  getProductName: (productId: string) => string,
): Promise<void> {
  const restored: Batch[] = [];

  for (const batch of batches) {
    const notificationId = await scheduleExpirationReminder({
      productName: getProductName(batch.productId),
      expirationDateISO: batch.expirationDate,
    });

    restored.push({...batch, notificationId});
  }

  await persist(restored);
}

export const batchesStorage = {
  getAll,
  getByProductId,
  add,
  update,
  remove,
  removeByProductId,
  restore,
};

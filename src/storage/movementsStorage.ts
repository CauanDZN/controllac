import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

import {Movement, MovementInput} from '@/types/movement';

const STORAGE_KEY = '@controllac:movements';

async function getAll(): Promise<Movement[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as Movement[]) : [];
}

async function persist(movements: Movement[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(movements));
}

async function add(input: MovementInput): Promise<Movement> {
  const movements = await getAll();

  const movement: Movement = {
    ...input,
    id: Crypto.randomUUID(),
    date: new Date().toISOString(),
  };

  await persist([movement, ...movements]);

  return movement;
}

export const movementsStorage = {
  getAll,
  add,
};

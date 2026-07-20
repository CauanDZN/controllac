import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

import {Product, ProductInput} from '@/types/product';

const STORAGE_KEY = '@controllac:products';

async function getAll(): Promise<Product[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as Product[]) : [];
}

async function persist(products: Product[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

async function add(input: ProductInput): Promise<Product> {
  const products = await getAll();

  const product: Product = {
    ...input,
    id: Crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  await persist([product, ...products]);

  return product;
}

async function remove(id: string): Promise<void> {
  const products = await getAll();
  await persist(products.filter(product => product.id !== id));
}

export const productsStorage = {
  getAll,
  add,
  remove,
};

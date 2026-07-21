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

async function findByBarcode(barcode: string): Promise<Product | undefined> {
  const products = await getAll();
  return products.find(product => product.barcode === barcode);
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

async function update(id: string, input: ProductInput): Promise<Product> {
  const products = await getAll();
  const existing = products.find(product => product.id === id);

  if (!existing) {
    throw new Error(`Product ${id} not found`);
  }

  const updated: Product = {...existing, ...input};

  await persist(
    products.map(product => (product.id === id ? updated : product)),
  );

  return updated;
}

async function remove(id: string): Promise<void> {
  const products = await getAll();
  await persist(products.filter(product => product.id !== id));
}

export const productsStorage = {
  getAll,
  findByBarcode,
  add,
  update,
  remove,
};

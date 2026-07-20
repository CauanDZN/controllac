import AsyncStorage from '@react-native-async-storage/async-storage';

import {productsStorage} from '@/storage/productsStorage';
import {ProductInput} from '@/types/product';

const baseInput: ProductInput = {
  name: 'Queijo Minas',
  barcode: '7891000100103',
  category: 'cheese',
  amount: '10',
  supplier: '12.345.678/0001-99',
  fabricationDate: '2026-01-01',
  expirationDate: '2026-06-01',
};

describe('productsStorage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('starts empty', async () => {
    expect(await productsStorage.getAll()).toEqual([]);
  });

  it('adds a product with a generated id and createdAt', async () => {
    const product = await productsStorage.add(baseInput);

    expect(typeof product.id).toBe('string');
    expect(product.id.length).toBeGreaterThan(0);
    expect(typeof product.createdAt).toBe('string');
    expect(product.name).toBe(baseInput.name);

    const all = await productsStorage.getAll();
    expect(all).toHaveLength(1);
    expect(all[0]).toEqual(product);
  });

  it('prepends new products so the most recent comes first', async () => {
    const first = await productsStorage.add(baseInput);
    const second = await productsStorage.add({
      ...baseInput,
      name: 'Iogurte Natural',
      category: 'yogurt',
    });

    const all = await productsStorage.getAll();
    expect(all.map(product => product.id)).toEqual([second.id, first.id]);
  });

  it('generates unique ids for each product', async () => {
    const first = await productsStorage.add(baseInput);
    const second = await productsStorage.add(baseInput);

    expect(first.id).not.toBe(second.id);
  });

  it('removes a product by id without touching the others', async () => {
    const first = await productsStorage.add(baseInput);
    const second = await productsStorage.add({
      ...baseInput,
      name: 'Manteiga',
      category: 'butter',
    });

    await productsStorage.remove(first.id);

    const all = await productsStorage.getAll();
    expect(all).toHaveLength(1);
    expect(all[0].id).toBe(second.id);
  });
});

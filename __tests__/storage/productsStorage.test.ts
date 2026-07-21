import AsyncStorage from '@react-native-async-storage/async-storage';

import {productsStorage} from '@/storage/productsStorage';
import {ProductInput} from '@/types/product';

const baseInput: ProductInput = {
  name: 'Queijo Minas',
  barcode: '7891000100103',
  category: 'cheese',
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

  it('updates an existing product in place', async () => {
    const product = await productsStorage.add(baseInput);

    const updated = await productsStorage.update(product.id, {
      ...baseInput,
      name: 'Queijo Minas Padrão',
    });

    expect(updated.id).toBe(product.id);
    expect(updated.name).toBe('Queijo Minas Padrão');
    expect(updated.createdAt).toBe(product.createdAt);

    const all = await productsStorage.getAll();
    expect(all).toHaveLength(1);
    expect(all[0].name).toBe('Queijo Minas Padrão');
  });

  it('finds a product by barcode', async () => {
    const product = await productsStorage.add(baseInput);
    await productsStorage.add({
      ...baseInput,
      name: 'Outro produto',
      barcode: '0000000000000',
    });

    const found = await productsStorage.findByBarcode(baseInput.barcode);
    expect(found?.id).toBe(product.id);
  });

  it('returns undefined when no product matches the barcode', async () => {
    await productsStorage.add(baseInput);

    const found = await productsStorage.findByBarcode('does-not-exist');
    expect(found).toBeUndefined();
  });
});

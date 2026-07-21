import AsyncStorage from '@react-native-async-storage/async-storage';
import {addDays, format} from 'date-fns';

import {productsStorage} from '@/storage/productsStorage';
import {notificationLogStorage} from '@/storage/notificationLogStorage';
import {Batch} from '@/types/batch';
import {Product} from '@/types/product';
import {checkAndNotifyLowStock, getStockStatus} from '@/utils/stock';

const futureExpiration = format(addDays(new Date(), 10), 'yyyy-MM-dd');

function buildBatch(overrides: Partial<Batch> = {}): Batch {
  return {
    id: 'batch-1',
    productId: 'product-1',
    amount: '5',
    supplier: 'Fornecedor X',
    purchaseDate: '2026-01-01',
    fabricationDate: '2026-01-01',
    expirationDate: futureExpiration,
    createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

function buildProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'product-1',
    name: 'Queijo Minas',
    barcode: '123',
    category: 'cheese',
    createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('getStockStatus', () => {
  it('sums the amount across every batch of the product', () => {
    const product = buildProduct({minimumStock: 3});
    const batches = [
      buildBatch({id: 'b1', amount: '2'}),
      buildBatch({id: 'b2', amount: '1'}),
    ];

    expect(getStockStatus(product, batches).currentStock).toBe(3);
  });

  it('is never low when the product has no minimum stock configured', () => {
    const product = buildProduct({minimumStock: undefined});
    const batches = [buildBatch({amount: '0'})];

    expect(getStockStatus(product, batches).isLow).toBe(false);
  });

  it('flags low stock when current stock is below the minimum', () => {
    const product = buildProduct({minimumStock: 5});
    const batches = [buildBatch({amount: '2'})];

    expect(getStockStatus(product, batches).isLow).toBe(true);
  });

  it('does not flag low stock when current stock meets the minimum', () => {
    const product = buildProduct({minimumStock: 5});
    const batches = [buildBatch({amount: '5'})];

    expect(getStockStatus(product, batches).isLow).toBe(false);
  });

  it('ignores batches from other products', () => {
    const product = buildProduct({minimumStock: 1});
    const batches = [buildBatch({productId: 'other-product', amount: '100'})];

    expect(getStockStatus(product, batches).currentStock).toBe(0);
  });
});

describe('checkAndNotifyLowStock', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it('logs a low-stock notification when the product falls below the minimum', async () => {
    const product = await productsStorage.add({
      name: 'Queijo Minas',
      barcode: '123',
      category: 'cheese',
      minimumStock: 5,
    });

    await checkAndNotifyLowStock(product.id);

    const log = await notificationLogStorage.getAll();
    expect(log).toHaveLength(1);
    expect(log[0].title).toBe('Estoque baixo');
  });

  it('does nothing when the product has no minimum stock configured', async () => {
    const product = await productsStorage.add({
      name: 'Iogurte',
      barcode: '456',
      category: 'yogurt',
    });

    await checkAndNotifyLowStock(product.id);

    expect(await notificationLogStorage.getAll()).toEqual([]);
  });
});

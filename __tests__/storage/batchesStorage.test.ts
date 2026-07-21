import AsyncStorage from '@react-native-async-storage/async-storage';
import {addDays, format} from 'date-fns';
import * as Notifications from 'expo-notifications';

import {batchesStorage} from '@/storage/batchesStorage';
import {movementsStorage} from '@/storage/movementsStorage';
import {BatchInput} from '@/types/batch';

const futureExpiration = format(addDays(new Date(), 10), 'yyyy-MM-dd');

const baseInput: BatchInput = {
  productId: 'product-1',
  amount: '10',
  supplier: '12.345.678/0001-99',
  purchaseDate: '2026-01-01',
  fabricationDate: '2026-01-01',
  expirationDate: futureExpiration,
};

const product = {name: 'Queijo Minas', category: 'cheese'};

describe('batchesStorage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it('starts empty', async () => {
    expect(await batchesStorage.getAll()).toEqual([]);
  });

  it('adds a batch and schedules a reminder notification', async () => {
    const batch = await batchesStorage.add(baseInput, product.name);

    expect(typeof batch.id).toBe('string');
    expect(batch.notificationId).toEqual(expect.any(String));
    expect(batch.productId).toBe('product-1');

    const all = await batchesStorage.getAll();
    expect(all).toHaveLength(1);
  });

  it('lists batches by productId', async () => {
    const batch = await batchesStorage.add(baseInput, 'Produto A');
    await batchesStorage.add(
      {...baseInput, productId: 'product-2'},
      'Produto B',
    );

    const forProduct = await batchesStorage.getByProductId('product-1');
    expect(forProduct.map(item => item.id)).toEqual([batch.id]);
  });

  it('cancels the old reminder and schedules a new one on update', async () => {
    const batch = await batchesStorage.add(baseInput, product.name);

    const updated = await batchesStorage.update(
      batch.id,
      {...baseInput, amount: '20'},
      product.name,
    );

    expect(Notifications.cancelScheduledNotificationAsync).toHaveBeenCalledWith(
      batch.notificationId,
    );
    expect(updated.amount).toBe('20');
    expect(updated.notificationId).toEqual(expect.any(String));
  });

  it('cancels the reminder on remove and records a sold movement', async () => {
    const batch = await batchesStorage.add(
      {...baseInput, costPrice: '5', salePrice: '8'},
      product.name,
    );

    await batchesStorage.remove(batch.id, 'sold', product);

    expect(Notifications.cancelScheduledNotificationAsync).toHaveBeenCalledWith(
      batch.notificationId,
    );
    expect(await batchesStorage.getAll()).toEqual([]);

    const movements = await movementsStorage.getAll();
    expect(movements).toHaveLength(1);
    expect(movements[0]).toMatchObject({
      productId: 'product-1',
      productName: product.name,
      category: product.category,
      type: 'sold',
      amount: '10',
      costPrice: '5',
      salePrice: '8',
    });
  });

  it('records a lost movement when the reason is loss', async () => {
    const batch = await batchesStorage.add(baseInput, product.name);

    await batchesStorage.remove(batch.id, 'lost', product);

    const movements = await movementsStorage.getAll();
    expect(movements[0].type).toBe('lost');
  });

  it('removeByProductId cascades and cancels every reminder without recording movements', async () => {
    const first = await batchesStorage.add(baseInput, 'Produto A');
    const second = await batchesStorage.add(baseInput, 'Produto A');
    await batchesStorage.add(
      {...baseInput, productId: 'other-product'},
      'Produto B',
    );

    await batchesStorage.removeByProductId('product-1');

    expect(Notifications.cancelScheduledNotificationAsync).toHaveBeenCalledWith(
      first.notificationId,
    );
    expect(Notifications.cancelScheduledNotificationAsync).toHaveBeenCalledWith(
      second.notificationId,
    );

    const remaining = await batchesStorage.getAll();
    expect(remaining).toHaveLength(1);
    expect(remaining[0].productId).toBe('other-product');

    expect(await movementsStorage.getAll()).toEqual([]);
  });

  it('does not schedule a reminder when the lead time has already passed', async () => {
    const soonExpiration = format(addDays(new Date(), 1), 'yyyy-MM-dd');

    const batch = await batchesStorage.add(
      {...baseInput, expirationDate: soonExpiration},
      product.name,
    );

    expect(batch.notificationId).toBeUndefined();
  });

  describe('restore', () => {
    it('reschedules a fresh reminder for each imported batch', async () => {
      const imported = [
        {
          id: 'imported-1',
          productId: 'product-1',
          amount: '5',
          supplier: baseInput.supplier,
          purchaseDate: baseInput.purchaseDate,
          fabricationDate: baseInput.fabricationDate,
          expirationDate: futureExpiration,
          notificationId: 'stale-id-from-another-device',
          createdAt: '2026-01-01T00:00:00.000Z',
        },
      ];

      await batchesStorage.restore(imported, () => 'Queijo Minas');

      const all = await batchesStorage.getAll();
      expect(all).toHaveLength(1);
      expect(all[0].id).toBe('imported-1');
      expect(all[0].notificationId).toEqual(expect.any(String));
      expect(all[0].notificationId).not.toBe('stale-id-from-another-device');
    });

    it('replaces the whole batch list', async () => {
      await batchesStorage.add(baseInput, 'Produto existente');

      await batchesStorage.restore([], () => 'Produto');

      expect(await batchesStorage.getAll()).toEqual([]);
    });
  });
});

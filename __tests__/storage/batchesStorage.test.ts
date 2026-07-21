import AsyncStorage from '@react-native-async-storage/async-storage';
import {addDays, format} from 'date-fns';
import * as Notifications from 'expo-notifications';

import {batchesStorage} from '@/storage/batchesStorage';
import {BatchInput} from '@/types/batch';

const futureExpiration = format(addDays(new Date(), 10), 'yyyy-MM-dd');

const baseInput: BatchInput = {
  productId: 'product-1',
  amount: '10',
  supplier: '12.345.678/0001-99',
  fabricationDate: '2026-01-01',
  expirationDate: futureExpiration,
};

describe('batchesStorage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it('starts empty', async () => {
    expect(await batchesStorage.getAll()).toEqual([]);
  });

  it('adds a batch and schedules a reminder notification', async () => {
    const batch = await batchesStorage.add(baseInput, 'Queijo Minas');

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
    const batch = await batchesStorage.add(baseInput, 'Queijo Minas');

    const updated = await batchesStorage.update(
      batch.id,
      {...baseInput, amount: '20'},
      'Queijo Minas',
    );

    expect(Notifications.cancelScheduledNotificationAsync).toHaveBeenCalledWith(
      batch.notificationId,
    );
    expect(updated.amount).toBe('20');
    expect(updated.notificationId).toEqual(expect.any(String));
  });

  it('cancels the reminder on remove', async () => {
    const batch = await batchesStorage.add(baseInput, 'Queijo Minas');

    await batchesStorage.remove(batch.id);

    expect(Notifications.cancelScheduledNotificationAsync).toHaveBeenCalledWith(
      batch.notificationId,
    );
    expect(await batchesStorage.getAll()).toEqual([]);
  });

  it('removeByProductId cascades and cancels every reminder', async () => {
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
  });

  it('does not schedule a reminder when the lead time has already passed', async () => {
    const soonExpiration = format(addDays(new Date(), 1), 'yyyy-MM-dd');

    const batch = await batchesStorage.add(
      {...baseInput, expirationDate: soonExpiration},
      'Queijo Minas',
    );

    expect(batch.notificationId).toBeUndefined();
  });
});

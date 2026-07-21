import AsyncStorage from '@react-native-async-storage/async-storage';

import {notificationLogStorage} from '@/storage/notificationLogStorage';

describe('notificationLogStorage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('starts empty', async () => {
    expect(await notificationLogStorage.getAll()).toEqual([]);
  });

  it('adds an entry with a generated id and createdAt', async () => {
    const entry = await notificationLogStorage.add({
      title: 'Estoque baixo',
      body: 'Queijo Minas está com 2 unidade(s).',
      scheduledFor: '2026-07-20T09:00:00.000Z',
    });

    expect(typeof entry.id).toBe('string');
    expect(typeof entry.createdAt).toBe('string');

    const all = await notificationLogStorage.getAll();
    expect(all).toHaveLength(1);
    expect(all[0]).toEqual(entry);
  });

  it('prepends new entries so the most recent comes first', async () => {
    const first = await notificationLogStorage.add({
      title: 'A',
      body: 'a',
      scheduledFor: '2026-07-20T09:00:00.000Z',
    });
    const second = await notificationLogStorage.add({
      title: 'B',
      body: 'b',
      scheduledFor: '2026-07-21T09:00:00.000Z',
    });

    const all = await notificationLogStorage.getAll();
    expect(all.map(entry => entry.id)).toEqual([second.id, first.id]);
  });
});

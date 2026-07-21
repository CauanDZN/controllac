import AsyncStorage from '@react-native-async-storage/async-storage';

import {movementsStorage} from '@/storage/movementsStorage';
import {MovementInput} from '@/types/movement';

const baseInput: MovementInput = {
  productId: 'product-1',
  productName: 'Queijo Minas',
  category: 'cheese',
  type: 'sold',
  amount: '5',
  costPrice: '3',
  salePrice: '6',
};

describe('movementsStorage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('starts empty', async () => {
    expect(await movementsStorage.getAll()).toEqual([]);
  });

  it('adds a movement with a generated id and date', async () => {
    const movement = await movementsStorage.add(baseInput);

    expect(typeof movement.id).toBe('string');
    expect(typeof movement.date).toBe('string');
    expect(movement.type).toBe('sold');

    const all = await movementsStorage.getAll();
    expect(all).toHaveLength(1);
    expect(all[0]).toEqual(movement);
  });

  it('prepends new movements so the most recent comes first', async () => {
    const first = await movementsStorage.add(baseInput);
    const second = await movementsStorage.add({...baseInput, type: 'lost'});

    const all = await movementsStorage.getAll();
    expect(all.map(movement => movement.id)).toEqual([second.id, first.id]);
  });
});

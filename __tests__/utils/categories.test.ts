import {categories, getCategory} from '@/utils/categories';

describe('getCategory', () => {
  it('returns the matching category for a known key', () => {
    expect(getCategory('cheese')).toEqual(
      categories.find(category => category.key === 'cheese'),
    );
  });

  it('falls back to the last category for an unknown key', () => {
    expect(getCategory('does-not-exist')).toEqual(
      categories[categories.length - 1],
    );
  });
});

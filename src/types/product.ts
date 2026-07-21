import {CategoryKey} from '@/utils/categories';

export type Product = {
  id: string;
  name: string;
  barcode: string;
  category: CategoryKey;
  createdAt: string;
};

export type ProductInput = Omit<Product, 'id' | 'createdAt'>;

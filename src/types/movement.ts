export type MovementType = 'sold' | 'lost';

export type Movement = {
  id: string;
  productId: string;
  productName: string;
  category: string;
  type: MovementType;
  amount: string;
  costPrice?: string;
  salePrice?: string;
  date: string;
};

export type MovementInput = Omit<Movement, 'id' | 'date'>;

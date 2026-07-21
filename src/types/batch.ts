export type Batch = {
  id: string;
  productId: string;
  amount: string;
  supplier: string;
  purchaseDate: string;
  fabricationDate: string;
  expirationDate: string;
  costPrice?: string;
  salePrice?: string;
  notificationId?: string;
  createdAt: string;
};

export type BatchInput = Omit<Batch, 'id' | 'createdAt' | 'notificationId'>;

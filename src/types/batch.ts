export type Batch = {
  id: string;
  productId: string;
  amount: string;
  supplier: string;
  fabricationDate: string;
  expirationDate: string;
  notificationId?: string;
  createdAt: string;
};

export type BatchInput = Omit<Batch, 'id' | 'createdAt' | 'notificationId'>;

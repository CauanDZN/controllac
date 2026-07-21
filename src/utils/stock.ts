import {batchesStorage} from '@/storage/batchesStorage';
import {productsStorage} from '@/storage/productsStorage';
import {Batch} from '@/types/batch';
import {Product} from '@/types/product';
import {notifyLowStock} from '@/utils/notifications';

export interface StockStatus {
  currentStock: number;
  isLow: boolean;
}

export function getStockStatus(
  product: Product,
  batches: Batch[],
): StockStatus {
  const currentStock = batches
    .filter(batch => batch.productId === product.id)
    .reduce((total, batch) => total + (Number(batch.amount) || 0), 0);

  const isLow =
    product.minimumStock != null && currentStock < product.minimumStock;

  return {currentStock, isLow};
}

export async function checkAndNotifyLowStock(productId: string): Promise<void> {
  const [products, batches] = await Promise.all([
    productsStorage.getAll(),
    batchesStorage.getAll(),
  ]);
  const product = products.find(item => item.id === productId);

  if (!product || product.minimumStock == null) {
    return;
  }

  const {currentStock, isLow} = getStockStatus(product, batches);

  if (!isLow) {
    return;
  }

  await notifyLowStock({
    productName: product.name,
    currentStock,
    minimumStock: product.minimumStock,
  });
}

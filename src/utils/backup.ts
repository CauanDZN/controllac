import * as DocumentPicker from 'expo-document-picker';
import {File, Paths} from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import {batchesStorage} from '@/storage/batchesStorage';
import {productsStorage} from '@/storage/productsStorage';
import {Batch} from '@/types/batch';
import {Product} from '@/types/product';

const BACKUP_VERSION = 1;

export interface BackupPayload {
  version: number;
  exportedAt: string;
  products: Product[];
  batches: Batch[];
}

export function buildBackupPayload(
  products: Product[],
  batches: Batch[],
): BackupPayload {
  return {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    products,
    batches,
  };
}

export function isBackupPayload(value: unknown): value is BackupPayload {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<BackupPayload>;
  return Array.isArray(candidate.products) && Array.isArray(candidate.batches);
}

export async function exportBackup(): Promise<void> {
  const [products, batches] = await Promise.all([
    productsStorage.getAll(),
    batchesStorage.getAll(),
  ]);
  const payload = buildBackupPayload(products, batches);

  const fileName = `controllac-backup-${new Date().toISOString().slice(0, 10)}.json`;
  const file = new File(Paths.cache, fileName);

  file.create({overwrite: true});
  file.write(JSON.stringify(payload, null, 2));

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(file.uri, {
      mimeType: 'application/json',
      dialogTitle: 'Exportar backup do Controllac',
    });
  }
}

export async function importBackup(): Promise<{
  productsCount: number;
  batchesCount: number;
} | null> {
  const result = await DocumentPicker.getDocumentAsync({
    type: 'application/json',
    copyToCacheDirectory: true,
  });

  if (result.canceled || !result.assets[0]) {
    return null;
  }

  const file = new File(result.assets[0].uri);
  const content = await file.text();
  const parsed: unknown = JSON.parse(content);

  if (!isBackupPayload(parsed)) {
    throw new Error('Arquivo de backup inválido');
  }

  const productNamesById = new Map(
    parsed.products.map(product => [product.id, product.name]),
  );

  await productsStorage.restore(parsed.products);
  await batchesStorage.restore(
    parsed.batches,
    productId => productNamesById.get(productId) ?? 'Produto',
  );

  return {
    productsCount: parsed.products.length,
    batchesCount: parsed.batches.length,
  };
}

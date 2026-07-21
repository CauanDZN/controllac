import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import {File} from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import {batchesStorage} from '@/storage/batchesStorage';
import {productsStorage} from '@/storage/productsStorage';
import {
  buildBackupPayload,
  exportBackup,
  importBackup,
  isBackupPayload,
} from '@/utils/backup';

const getDocumentAsyncMock = DocumentPicker.getDocumentAsync as jest.Mock;

describe('buildBackupPayload', () => {
  it('wraps products and batches with a version and a timestamp', () => {
    const payload = buildBackupPayload([], []);

    expect(payload.version).toBe(1);
    expect(typeof payload.exportedAt).toBe('string');
    expect(payload.products).toEqual([]);
    expect(payload.batches).toEqual([]);
  });
});

describe('isBackupPayload', () => {
  it('accepts an object with products and batches arrays', () => {
    expect(isBackupPayload({products: [], batches: []})).toBe(true);
  });

  it('rejects anything that is not shaped like a backup', () => {
    expect(isBackupPayload(null)).toBe(false);
    expect(isBackupPayload('not an object')).toBe(false);
    expect(isBackupPayload({products: []})).toBe(false);
    expect(isBackupPayload({batches: []})).toBe(false);
  });
});

describe('exportBackup', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it('shares the generated backup file', async () => {
    await exportBackup();

    expect(Sharing.shareAsync).toHaveBeenCalled();
  });
});

describe('importBackup', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it('returns null when the user cancels the picker', async () => {
    getDocumentAsyncMock.mockResolvedValueOnce({canceled: true, assets: null});

    expect(await importBackup()).toBeNull();
  });

  it('restores products and batches from a valid backup file', async () => {
    const payload = {
      version: 1,
      exportedAt: '2026-01-01T00:00:00.000Z',
      products: [
        {
          id: 'p1',
          name: 'Queijo Minas',
          barcode: '123',
          category: 'cheese',
          createdAt: '2026-01-01T00:00:00.000Z',
        },
      ],
      batches: [
        {
          id: 'b1',
          productId: 'p1',
          amount: '5',
          supplier: 'Fornecedor X',
          purchaseDate: '2026-01-01',
          fabricationDate: '2026-01-01',
          expirationDate: '2099-01-01',
          createdAt: '2026-01-01T00:00:00.000Z',
        },
      ],
    };

    const file = new File('mock-backup.json');
    file.create();
    file.write(JSON.stringify(payload));

    getDocumentAsyncMock.mockResolvedValueOnce({
      canceled: false,
      assets: [
        {
          uri: file.uri,
          name: 'mock-backup.json',
          mimeType: 'application/json',
          lastModified: Date.now(),
        },
      ],
    });

    const result = await importBackup();

    expect(result).toEqual({productsCount: 1, batchesCount: 1});
    expect(await productsStorage.getAll()).toHaveLength(1);
    expect(await batchesStorage.getAll()).toHaveLength(1);
  });

  it('throws for a file that is not a valid backup', async () => {
    const file = new File('invalid.json');
    file.create();
    file.write(JSON.stringify({foo: 'bar'}));

    getDocumentAsyncMock.mockResolvedValueOnce({
      canceled: false,
      assets: [
        {
          uri: file.uri,
          name: 'invalid.json',
          mimeType: 'application/json',
          lastModified: Date.now(),
        },
      ],
    });

    await expect(importBackup()).rejects.toThrow();
  });
});

import { MarketplaceCar } from '../types';
import { MOCK_MARKETPLACE_CARS } from '../constants';

const DB_NAME = 'AutoGeniusDB';
const DB_VERSION = 1;
const STORE_NAME = 'marketplace_cars';

// Helper to open the database
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
};

export const carStorage = {
  // Load all cars
  getAll: async (): Promise<MarketplaceCar[]> => {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => {
          const results = request.result;
          // If DB is empty, return MOCK data
          if (!results || results.length === 0) {
            resolve(MOCK_MARKETPLACE_CARS);
          } else {
            resolve(results);
          }
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Failed to load from IndexedDB, falling back to mock', error);
      return MOCK_MARKETPLACE_CARS;
    }
  },

  // Save a single car (update or insert)
  saveCar: async (car: MarketplaceCar): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(car);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  // Initialize DB with default data if empty
  initialize: async (): Promise<void> => {
    const cars = await carStorage.getAll();
    if (cars === MOCK_MARKETPLACE_CARS) {
        // If we got mocks back, ensures they are saved to DB for future edits
        const db = await openDB();
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        MOCK_MARKETPLACE_CARS.forEach(car => store.put(car));
    }
  },

  // Clear DB
  clear: async (): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
};
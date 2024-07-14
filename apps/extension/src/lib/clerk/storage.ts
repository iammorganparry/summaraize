import { storage } from "~lib/storage/client";

type StorageCache = {
  createKey: (...keys: string[]) => string;
  get: <T>(key: string) => Promise<T>;
  remove: (key: string) => Promise<void>;
  set: (key: string, value: string) => Promise<void>;
};
export const storageCache = {
  createKey: (...keys: string[]) => keys.join(":"),
  get: async <T>(key: string) => {
    try {
      const value = await storage.get(key);
      console.log("Value", value);
      if (!value) {
        return null as T;
      }
      return value as T;
    } catch (error) {
      console.warn("Error getting value from storage", error);
      return null as T;
    }
  },
  remove: async (key: string) => storage.remove(key),
  set: async (key: string, value: string) => {
    await storage.set(key, value);
  },
} satisfies StorageCache;

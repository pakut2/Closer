import { Injectable } from "@angular/core";

export const STORAGE_KEY = {
  STOPS: "stops"
} as const;

type StorageKey = (typeof STORAGE_KEY)[keyof typeof STORAGE_KEY];

@Injectable({ providedIn: "root" })
export class StorageService<T extends object> {
  get(itemKey: StorageKey): T | null {
    const storageItem = localStorage.getItem(itemKey);

    if (!storageItem) {
      return null;
    }

    return JSON.parse(storageItem) as T;
  }

  add(itemKey: StorageKey, item: T): boolean {
    const serializedItem = JSON.stringify(item);

    if (!serializedItem) {
      return false;
    }

    localStorage.setItem(itemKey, serializedItem);

    return true;
  }
}

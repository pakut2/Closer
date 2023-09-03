import { Injectable } from "@angular/core";
import { Preferences } from "@capacitor/preferences";
import { from, Observable } from "rxjs";

export const STORAGE_KEY = {
  STOPS: "stops",
  SEARCH_DISTANCE: "distance",
  DEVICE_TOKEN: "deviceToken"
} as const;

type StorageKey = (typeof STORAGE_KEY)[keyof typeof STORAGE_KEY];

@Injectable({ providedIn: "root" })
export class StorageService<T extends object> {
  get(itemKey: StorageKey): Observable<T | null> {
    return from(
      (async () => {
        const { value: storageItem } = await Preferences.get({ key: itemKey });

        if (!storageItem) {
          return null;
        }

        return JSON.parse(storageItem) as T;
      })()
    );
  }

  async set(itemKey: StorageKey, item: T): Promise<boolean> {
    const serializedItem = JSON.stringify(item);

    if (!serializedItem) {
      return false;
    }

    await Preferences.set({ key: itemKey, value: serializedItem });

    return true;
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private isBrowser = typeof window !== 'undefined'; // Vérifie si on est bien dans le navigateur

  getLocalStorageItem(key: string): string | null {
    return this.isBrowser ? localStorage.getItem(key) : null;
  }

  setLocalStorageItem(key: string, value: string): void {
    if (this.isBrowser) {
      localStorage.setItem(key, value);
    }
  }

  getSessionStorageItem(key: string): string | null {
    return this.isBrowser ? sessionStorage.getItem(key) : null;
  }

  setSessionStorageItem(key: string, value: string): void {
    if (this.isBrowser) {
      sessionStorage.setItem(key, value);
    }
  }
}

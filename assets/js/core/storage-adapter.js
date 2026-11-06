/**
 * FAB STEEL CONSULTANCY ERP - STORAGE ADAPTER
 * Unified storage engine abstraction supporting LocalStorage, SessionStorage & In-Memory fallback
 */

(function () {
  'use strict';

  class StorageAdapter {
    constructor(prefix = 'fab_erp_') {
      this.prefix = prefix;
      this.memoryFallback = new Map();
      this.isStorageAvailable = this.checkAvailability();
    }

    checkAvailability() {
      try {
        const testKey = `__fab_storage_test__`;
        window.localStorage.setItem(testKey, '1');
        window.localStorage.removeItem(testKey);
        return true;
      } catch (e) {
        console.warn('[StorageAdapter] localStorage is not available, falling back to memory storage.');
        return false;
      }
    }

    _key(key) {
      return key.startsWith(this.prefix) ? key : `${this.prefix}${key}`;
    }

    /**
     * Get item with optional default value
     */
    get(key, defaultValue = null) {
      const fullKey = this._key(key);
      if (this.isStorageAvailable) {
        try {
          const item = window.localStorage.getItem(fullKey);
          if (item === null || item === undefined) return defaultValue;
          return JSON.parse(item);
        } catch (err) {
          console.error(`[StorageAdapter] Error reading key '${fullKey}':`, err);
          return defaultValue;
        }
      } else {
        return this.memoryFallback.has(fullKey) ? this.memoryFallback.get(fullKey) : defaultValue;
      }
    }

    /**
     * Set item with JSON serialization
     */
    set(key, value) {
      const fullKey = this._key(key);
      if (this.isStorageAvailable) {
        try {
          const serialized = JSON.stringify(value);
          window.localStorage.setItem(fullKey, serialized);
          if (window.FabEventBus) {
            window.FabEventBus.emit('storage:changed', { key: fullKey, value });
          }
          return true;
        } catch (err) {
          console.error(`[StorageAdapter] Error setting key '${fullKey}':`, err);
          return false;
        }
      } else {
        this.memoryFallback.set(fullKey, value);
        return true;
      }
    }

    /**
     * Remove item
     */
    remove(key) {
      const fullKey = this._key(key);
      if (this.isStorageAvailable) {
        window.localStorage.removeItem(fullKey);
      } else {
        this.memoryFallback.delete(fullKey);
      }
      if (window.FabEventBus) {
        window.FabEventBus.emit('storage:removed', { key: fullKey });
      }
      return true;
    }

    /**
     * Clear all keys with current prefix
     */
    clearAll() {
      if (this.isStorageAvailable) {
        const toRemove = [];
        for (let i = 0; i < window.localStorage.length; i++) {
          const key = window.localStorage.key(i);
          if (key && key.startsWith(this.prefix)) {
            toRemove.push(key);
          }
        }
        toRemove.forEach(k => window.localStorage.removeItem(k));
      } else {
        this.memoryFallback.clear();
      }
      return true;
    }

    /**
     * Export all stored data as JSON snapshot
     */
    exportSnapshot() {
      const snapshot = {};
      if (this.isStorageAvailable) {
        for (let i = 0; i < window.localStorage.length; i++) {
          const key = window.localStorage.key(i);
          if (key && key.startsWith(this.prefix)) {
            const shortKey = key.slice(this.prefix.length);
            try {
              snapshot[shortKey] = JSON.parse(window.localStorage.getItem(key));
            } catch (e) {
              snapshot[shortKey] = window.localStorage.getItem(key);
            }
          }
        }
      } else {
        this.memoryFallback.forEach((v, k) => {
          const shortKey = k.startsWith(this.prefix) ? k.slice(this.prefix.length) : k;
          snapshot[shortKey] = v;
        });
      }
      return snapshot;
    }

    /**
     * Import a JSON snapshot to restore data
     */
    importSnapshot(snapshot) {
      if (!snapshot || typeof snapshot !== 'object') return false;
      Object.keys(snapshot).forEach(key => {
        this.set(key, snapshot[key]);
      });
      return true;
    }
  }

  window.FabStorageAdapter = new StorageAdapter(
    (window.FabConfig && window.FabConfig.STORAGE_PREFIX) || 'fab_erp_'
  );
})();


// services/localStorageService.js — Low-level helpers for reading and writing
// structured data blobs to/from localStorage.
// Used by the export and reset features in the Profile section.

import KEYS from './storageKeys';

/** Returns a snapshot of all gym app data for export purposes. */
export function getAllData() {
    return Object.values(KEYS).reduce((acc, key) => {
        try {
            acc[key] = JSON.parse(window.localStorage.getItem(key) ?? 'null');
        } catch {
            acc[key] = null;
        }
        return acc;
    }, {});
}

/** Removes all gym app keys from localStorage. */
export function clearAllData() {
    Object.values(KEYS).forEach((key) => window.localStorage.removeItem(key));
}

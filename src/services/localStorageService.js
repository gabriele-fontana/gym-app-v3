// services/localStorageService.js — Low-level helpers for reading and writing
// structured data blobs to/from localStorage.
// Used by the export and reset features in the Profile section.

/** Returns a snapshot of all gym app data for export purposes. */
export function getAllData() {
    const keys = ['gym_plans', 'gym_sessions', 'gym_progress', 'gym_weight_log', 'gym_tracking_enabled'];
    return keys.reduce((acc, key) => {
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
    const keys = ['gym_plans', 'gym_sessions', 'gym_progress', 'gym_weight_log', 'gym_tracking_enabled'];
    keys.forEach((key) => window.localStorage.removeItem(key));
}

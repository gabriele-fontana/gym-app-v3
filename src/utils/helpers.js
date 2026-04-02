// utils/helpers.js — Shared utility functions used across the app.

/**
 * Formats an ISO date string to a human-readable short date.
 * @param {string} iso
 * @returns {string} e.g. "02/04/2026"
 */
export function formatDate(iso) {
    return new Date(iso).toLocaleDateString('it-IT');
}

/**
 * Returns today's date as YYYY-MM-DD.
 * @returns {string}
 */
export function todayKey() {
    return new Date().toISOString().slice(0, 10);
}

/**
 * Formats a duration in seconds as MM:SS.
 * @param {number} seconds
 * @returns {string}
 */
export function formatTimer(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

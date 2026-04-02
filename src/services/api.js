// services/api.js — Base HTTP client for the future REST API integration.
//
// Currently all data lives in localStorage. When the Express API is ready:
//   1. Set REACT_APP_API_URL in your .env file
//   2. Replace the localStorage service calls in context/ with these API calls
//
// All methods throw on non-2xx responses so callers can handle errors uniformly.

const BASE_URL = process.env.REACT_APP_API_URL ?? '';

/**
 * Wraps fetch with JSON defaults and error handling.
 * @param {string} path
 * @param {RequestInit} [options]
 * @returns {Promise<any>}
 */
async function request(path, options = {}) {
    const response = await fetch(`${BASE_URL}${path}`, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options,
    });

    if (!response.ok) {
        const message = await response.text().catch(() => response.statusText);
        throw new Error(`API ${response.status}: ${message}`);
    }

    // Return null for 204 No Content
    if (response.status === 204) return null;
    return response.json();
}

export const api = {
    get: (path) => request(path),
    post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
    put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
    patch: (path, body) => request(path, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: (path) => request(path, { method: 'DELETE' }),
};

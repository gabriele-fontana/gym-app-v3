// hooks/useLocalStorage.js — Generic hook for persisting state in localStorage.
// Usage: const [value, setValue] = useLocalStorage('key', initialValue);
// Behaves like useState but reads/writes to window.localStorage.

import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item !== null ? JSON.parse(item) : initialValue;
        } catch {
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(storedValue));
        } catch {
            // quota exceeded or private browsing — fail silently
        }
    }, [key, storedValue]);

    return [storedValue, setStoredValue];
}

export default useLocalStorage;

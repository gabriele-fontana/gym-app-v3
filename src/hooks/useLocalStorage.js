// hooks/useLocalStorage.js — Generic hook for persisting state in localStorage.
//
// Usage:
//   const [value, setValue, removeValue] = useLocalStorage('key', initialValue);
//
// Returns a tuple:
//   [0] value        — current state (mirrors localStorage)
//   [1] setValue(v)  — update state and persist to localStorage
//   [2] removeValue()— delete the key from localStorage and reset to initialValue

import { useState, useEffect, useCallback } from 'react';

function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item !== null ? JSON.parse(item) : initialValue;
        } catch {
            return initialValue;
        }
    });

    // Persist on every change
    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(storedValue));
        } catch {
            // Quota exceeded or private browsing — fail silently
        }
    }, [key, storedValue]);

    // Remove the key from localStorage and reset state to initialValue
    const removeValue = useCallback(() => {
        try {
            window.localStorage.removeItem(key);
        } catch {
            // fail silently
        }
        setStoredValue(initialValue);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key]);

    return [storedValue, setStoredValue, removeValue];
}

export default useLocalStorage;

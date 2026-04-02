// context/ProgressContext.js — Global state for progress tracking.
// Provides:
//   - trackingEnabled boolean toggle (persisted to local storage)
//   - progress records per exercise { exerciseId, date, load }
//   - weightLog entries { date, weight }
//   - actions: recordLoad, addWeightEntry, deleteWeightEntry, clearAllProgress

import React, { createContext, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const ProgressContext = createContext(null);

export function ProgressProvider({ children }) {
    const [trackingEnabled, setTrackingEnabled] = useLocalStorage('gym_tracking_enabled', false);
    const [progress, setProgress] = useLocalStorage('gym_progress', {});
    const [weightLog, setWeightLog] = useLocalStorage('gym_weight_log', []);

    /** @param {string} exerciseId @param {number} load */
    function recordLoad(exerciseId, load) {
        const entry = { date: new Date().toISOString(), load };
        setProgress((prev) => ({
            ...prev,
            [exerciseId]: [...(prev[exerciseId] || []), entry],
        }));
    }

    /** @param {number} weight */
    function addWeightEntry(weight) {
        setWeightLog((prev) => [...prev, { date: new Date().toISOString(), weight }]);
    }

    /** @param {number} index */
    function deleteWeightEntry(index) {
        setWeightLog((prev) => prev.filter((_, i) => i !== index));
    }

    function clearAllProgress() {
        setProgress({});
        setWeightLog([]);
    }

    return (
        <ProgressContext.Provider
            value={{ trackingEnabled, setTrackingEnabled, progress, recordLoad, weightLog, addWeightEntry, deleteWeightEntry, clearAllProgress }}
        >
            {children}
        </ProgressContext.Provider>
    );
}

export function useProgressContext() {
    return useContext(ProgressContext);
}

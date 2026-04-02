// hooks/useProgress.js — Convenience hook that re-exports ProgressContext values.

import { useProgressContext } from '../context/ProgressContext';

export function useProgress() {
    return useProgressContext();
}

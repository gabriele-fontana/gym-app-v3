// hooks/useWorkouts.js — Convenience hook that re-exports WorkoutContext values.
// Use in components instead of importing useWorkoutContext directly.

import { useWorkoutContext } from '../context/WorkoutContext';

export function useWorkouts() {
    return useWorkoutContext();
}

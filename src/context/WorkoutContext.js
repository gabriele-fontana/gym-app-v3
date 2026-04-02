// context/WorkoutContext.js — Global state for workout plans.
// Provides: plans array, and CRUD actions (addPlan, updatePlan, deletePlan,
// addExercise, updateExercise, deleteExercise).
// Data is persisted to local storage via the useLocalStorage hook.

import React, { createContext, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import KEYS from '../services/storageKeys';

const WorkoutContext = createContext(null);

export function WorkoutProvider({ children }) {
    const [plans, setPlans] = useLocalStorage(KEYS.PLANS, []);

    /** @param {{ name: string }} planData */
    function addPlan(planData) {
        const newPlan = { id: crypto.randomUUID(), exercises: [], ...planData };
        setPlans((prev) => [...prev, newPlan]);
    }

    /** @param {string} id @param {object} updates */
    function updatePlan(id, updates) {
        setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    }

    /** @param {string} id */
    function deletePlan(id) {
        setPlans((prev) => prev.filter((p) => p.id !== id));
    }

    /** @param {string} planId @param {object} exerciseData */
    function addExercise(planId, exerciseData) {
        const newEx = { id: crypto.randomUUID(), notes: '', ...exerciseData };
        setPlans((prev) =>
            prev.map((p) =>
                p.id === planId ? { ...p, exercises: [...p.exercises, newEx] } : p
            )
        );
    }

    /** @param {string} planId @param {string} exId @param {object} updates */
    function updateExercise(planId, exId, updates) {
        setPlans((prev) =>
            prev.map((p) =>
                p.id === planId
                    ? { ...p, exercises: p.exercises.map((e) => (e.id === exId ? { ...e, ...updates } : e)) }
                    : p
            )
        );
    }

    /** @param {string} planId @param {string} exId */
    function deleteExercise(planId, exId) {
        setPlans((prev) =>
            prev.map((p) =>
                p.id === planId
                    ? { ...p, exercises: p.exercises.filter((e) => e.id !== exId) }
                    : p
            )
        );
    }

    /**
     * Adds a superset entry: { type:'superset', id, rest, exerciseA:{id,...}, exerciseB:{id,...} }
     * @param {string} planId
     * @param {{ exerciseA: object, exerciseB: object, rest: number }} data
     */
    function addSuperset(planId, data) {
        const entry = {
            id: crypto.randomUUID(),
            type: 'superset',
            rest: data.rest,
            exerciseA: { id: crypto.randomUUID(), notes: '', ...data.exerciseA },
            exerciseB: { id: crypto.randomUUID(), notes: '', ...data.exerciseB },
        };
        setPlans((prev) =>
            prev.map((p) =>
                p.id === planId ? { ...p, exercises: [...p.exercises, entry] } : p
            )
        );
    }

    /** @param {string} planId @param {string} ssId @param {'exerciseA'|'exerciseB'} side @param {object} updates */
    function updateSupersetExercise(planId, ssId, side, updates) {
        setPlans((prev) =>
            prev.map((p) =>
                p.id === planId
                    ? {
                        ...p,
                        exercises: p.exercises.map((e) =>
                            e.id === ssId ? { ...e, [side]: { ...e[side], ...updates } } : e
                        ),
                    }
                    : p
            )
        );
    }

    /** @param {string} planId @param {string} ssId @param {number} rest */
    function updateSupersetRest(planId, ssId, rest) {
        setPlans((prev) =>
            prev.map((p) =>
                p.id === planId
                    ? { ...p, exercises: p.exercises.map((e) => (e.id === ssId ? { ...e, rest } : e)) }
                    : p
            )
        );
    }

    return (
        <WorkoutContext.Provider value={{
            plans, addPlan, updatePlan, deletePlan,
            addExercise, updateExercise, deleteExercise,
            addSuperset, updateSupersetExercise, updateSupersetRest,
        }}>
            {children}
        </WorkoutContext.Provider>
    );
}

export function useWorkoutContext() {
    return useContext(WorkoutContext);
}

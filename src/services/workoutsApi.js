// services/workoutsApi.js — Workout plan resource stubs for the future API.
//
// These mirror the WorkoutContext actions but talk to the Express API instead
// of localStorage. Swap the context to call these when REACT_APP_API_URL is set.

import { api } from './api';

export const workoutsApi = {
    /** @returns {Promise<Array>} */
    getAll: () => api.get('/api/plans'),

    /** @param {object} plan @returns {Promise<object>} */
    create: (plan) => api.post('/api/plans', plan),

    /** @param {string} id @param {object} updates @returns {Promise<object>} */
    update: (id, updates) => api.put(`/api/plans/${id}`, updates),

    /** @param {string} id @returns {Promise<null>} */
    remove: (id) => api.delete(`/api/plans/${id}`),

    /** @param {string} planId @param {object} exercise @returns {Promise<object>} */
    addExercise: (planId, exercise) => api.post(`/api/plans/${planId}/exercises`, exercise),

    /** @param {string} planId @param {string} exId @param {object} updates @returns {Promise<object>} */
    updateExercise: (planId, exId, updates) => api.patch(`/api/plans/${planId}/exercises/${exId}`, updates),

    /** @param {string} planId @param {string} exId @returns {Promise<null>} */
    removeExercise: (planId, exId) => api.delete(`/api/plans/${planId}/exercises/${exId}`),
};

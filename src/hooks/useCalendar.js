// hooks/useCalendar.js — Hook for calendar session data.
// Reads/writes workout sessions keyed by ISO date string (YYYY-MM-DD).
// A session: { planId, planName, date, exercises: [...] }

import useLocalStorage from './useLocalStorage';

export function useCalendar() {
    const [sessions, setSessions] = useLocalStorage('gym_sessions', {});

    /** @param {string} date YYYY-MM-DD @param {object} session */
    function addSession(date, session) {
        setSessions((prev) => ({ ...prev, [date]: session }));
    }

    /** @param {string} date */
    function removeSession(date) {
        setSessions((prev) => {
            const next = { ...prev };
            delete next[date];
            return next;
        });
    }

    /** @param {string} date @returns {object|undefined} */
    function getSession(date) {
        return sessions[date];
    }

    return { sessions, addSession, removeSession, getSession };
}

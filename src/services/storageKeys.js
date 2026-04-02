// services/storageKeys.js — Central registry of all localStorage keys used by the app.
// Import from here instead of using raw strings to avoid typos and aid future refactoring
// (e.g. swapping localStorage for an API layer).

const KEYS = {
    PLANS: 'gym_plans',
    SESSIONS: 'gym_sessions',
    PROGRESS: 'gym_progress',
    WEIGHT_LOG: 'gym_weight_log',
    TRACKING_ENABLED: 'gym_tracking_enabled',
};

export default KEYS;

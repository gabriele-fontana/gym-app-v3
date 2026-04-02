// serviceWorkerRegistration.js — Registers the Workbox service worker produced
// by CRA's build step (build/service-worker.js).
//
// NOTE: If you ever migrate to Vite, replace this file with the
// `vite-plugin-pwa` plugin and its `registerSW` helper instead.
//
// In production the service worker pre-caches the app shell so the app works
// fully offline. In development it is intentionally NOT activated to avoid
// stale-cache confusion.

const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4]\d|[01]?\d\d?)){3}$/)
);

/**
 * Call this from index.js to opt in to offline-first behaviour.
 * @param {{ onSuccess?: Function, onUpdate?: Function }} [config]
 */
export function register(config) {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
        const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);

        // Don't register if the page is served from a different origin
        if (publicUrl.origin !== window.location.origin) return;

        window.addEventListener('load', () => {
            const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

            if (isLocalhost) {
                // On localhost, validate the SW exists then log helpful messages
                checkValidServiceWorker(swUrl, config);
                navigator.serviceWorker.ready.then(() => {
                    console.log('[PWA] Running in offline-first mode via service worker.');
                });
            } else {
                registerValidSW(swUrl, config);
            }
        });
    }
}

function registerValidSW(swUrl, config) {
    navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
            registration.onupdatefound = () => {
                const installing = registration.installing;
                if (!installing) return;
                installing.onstatechange = () => {
                    if (installing.state === 'installed') {
                        if (navigator.serviceWorker.controller) {
                            // New content available; will be used after next reload
                            console.log('[PWA] New content available — reload to update.');
                            config?.onUpdate?.(registration);
                        } else {
                            // Pre-cached for offline use
                            console.log('[PWA] Content cached for offline use.');
                            config?.onSuccess?.(registration);
                        }
                    }
                };
            };
        })
        .catch((error) => console.error('[PWA] Service worker registration failed:', error));
}

function checkValidServiceWorker(swUrl, config) {
    fetch(swUrl, { headers: { 'Service-Worker': 'script' } })
        .then((response) => {
            const contentType = response.headers.get('content-type');
            if (response.status === 404 || (contentType && !contentType.includes('javascript'))) {
                // No SW found — reload as a normal page
                navigator.serviceWorker.ready.then((reg) => reg.unregister()).then(() => window.location.reload());
            } else {
                registerValidSW(swUrl, config);
            }
        })
        .catch(() => console.log('[PWA] No internet — running in offline mode.'));
}

/** Unregisters the service worker (useful for debugging). */
export function unregister() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
            .then((reg) => reg.unregister())
            .catch((err) => console.error(err));
    }
}

// Service Worker Registration
export function registerServiceWorker() {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
        console.log('❌ [PWA] Service Worker not supported');
        return;
    }

    console.log('✅ [PWA] Starting Service Worker registration...');

    window.addEventListener('load', async () => {
        try {
            console.log('🔄 [PWA] Attempting to register service worker at /sw.js');

            const registration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            }).catch((error) => {
                console.error('❌ [PWA] Registration failed immediately:', error);
                throw error;
            });

            console.log('✅ [PWA] Service Worker registered successfully!');
            console.log('📍 [PWA] Scope:', registration.scope);
            console.log('📊 [PWA] State:', registration.active?.state || 'installing');

            // Handle updates
            registration.addEventListener('updatefound', () => {
                console.log('🔄 [PWA] Update found, new service worker installing...');
                const newWorker = registration.installing;

                newWorker.addEventListener('statechange', () => {
                    console.log('🔄 [PWA] New worker state:', newWorker.state);
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        console.log('🆕 [PWA] New content available, refresh to update');
                        // Optionally show notification to user
                        if (window.confirm('New version available! Reload to update?')) {
                            newWorker.postMessage({ type: 'SKIP_WAITING' });
                            window.location.reload();
                        }
                    }
                });
            });

            // Listen for controller change
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                console.log('🔄 [PWA] Controller changed, reloading page...');
                window.location.reload();
            });

            // Handle messages from service worker
            navigator.serviceWorker.addEventListener('message', (event) => {
                console.log('📨 [PWA] Message from SW:', event.data);
                if (event.data && event.data.type === 'SYNC_REQUIRED') {
                    console.log('🔄 [PWA] Sync required');
                    window.dispatchEvent(new CustomEvent('sync-required'));
                }
            });

            console.log('✅ [PWA] All event listeners registered successfully');

        } catch (error) {
            console.error('❌ [PWA] Service Worker registration failed:', error);
            console.error('Error details:', error.message);
        }
    });
}

// Check online/offline status
export function setupOnlineStatusListener(callback) {
    if (typeof window === 'undefined') return;

    const handleOnline = () => {
        console.log('[PWA] Back online');
        callback(true);
    };

    const handleOffline = () => {
        console.log('[PWA] Gone offline');
        callback(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Return initial status
    callback(navigator.onLine);

    // Cleanup function
    return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
    };
}

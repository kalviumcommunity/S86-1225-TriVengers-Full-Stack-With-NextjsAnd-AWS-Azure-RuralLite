// Cache clearing utility for hard refresh
export const clearAllCaches = async () => {
    try {
        // Clear Service Worker caches
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(
                cacheNames.map(cacheName => caches.delete(cacheName))
            );
            console.log('✅ [Cache] Service Worker caches cleared');
        }

        // Clear localStorage (except auth token if needed)
        const authToken = localStorage.getItem('token');
        const authUser = localStorage.getItem('user');
        localStorage.clear();
        if (authToken) localStorage.setItem('token', authToken);
        if (authUser) localStorage.setItem('user', authUser);
        console.log('✅ [Cache] localStorage cleared');

        // Clear sessionStorage
        sessionStorage.clear();
        console.log('✅ [Cache] sessionStorage cleared');

        // Clear IndexedDB if used
        if ('indexedDB' in window) {
            const databases = await indexedDB.databases();
            databases.forEach(db => {
                if (db.name) {
                    indexedDB.deleteDatabase(db.name);
                }
            });
            console.log('✅ [Cache] IndexedDB cleared');
        }

        return true;
    } catch (error) {
        console.error('❌ [Cache] Error clearing caches:', error);
        return false;
    }
};

// Detect hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
export const setupHardRefreshDetection = () => {
    if (typeof window === 'undefined') return;

    // Check if this is a hard refresh (performance API)
    const perfData = window.performance.getEntriesByType('navigation')[0];
    if (perfData && perfData.type === 'reload') {
        // Check if shift key was pressed during reload
        const wasHardRefresh = sessionStorage.getItem('hardRefresh');
        if (wasHardRefresh === 'true') {
            console.log('🔄 [Cache] Hard refresh detected, clearing caches...');
            clearAllCaches().then(() => {
                sessionStorage.removeItem('hardRefresh');
                console.log('✅ [Cache] All caches cleared on hard refresh');
            });
        }
    }

    // Listen for keyboard shortcut
    window.addEventListener('keydown', (e) => {
        // Ctrl+Shift+R or Cmd+Shift+R
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'R') {
            sessionStorage.setItem('hardRefresh', 'true');
            console.log('🔄 [Cache] Hard refresh initiated');
        }
    });
};

// Manual cache clear function with feedback
export const manualClearCache = async () => {
    const cleared = await clearAllCaches();
    if (cleared) {
        // Reload the page after clearing
        window.location.reload();
    }
    return cleared;
};

// Clear SWR cache (if using useSWR)
export const clearSWRCache = () => {
    if (typeof window !== 'undefined') {
        // Clear all SWR cache keys
        const swrKeys = Object.keys(localStorage).filter(key =>
            key.startsWith('swr-') || key.startsWith('app-cache-')
        );
        swrKeys.forEach(key => localStorage.removeItem(key));
        console.log('✅ [Cache] SWR cache cleared');
    }
};

// Clear only offline/stale data
export const clearOfflineData = async () => {
    try {
        // Clear only runtime caches, keep precache
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            const runtimeCaches = cacheNames.filter(name =>
                name.includes('runtime') || name.includes('dynamic')
            );
            await Promise.all(
                runtimeCaches.map(cacheName => caches.delete(cacheName))
            );
            console.log('✅ [Cache] Offline/runtime caches cleared');
        }

        // Clear expired data from localStorage
        const expiredKeys = Object.keys(localStorage).filter(key => {
            try {
                const item = localStorage.getItem(key);
                if (item) {
                    const parsed = JSON.parse(item);
                    if (parsed.expiry && parsed.expiry < Date.now()) {
                        return true;
                    }
                }
            } catch (e) {
                // Not JSON, skip
            }
            return false;
        });
        expiredKeys.forEach(key => localStorage.removeItem(key));
        console.log('✅ [Cache] Expired localStorage data cleared');

        return true;
    } catch (error) {
        console.error('❌ [Cache] Error clearing offline data:', error);
        return false;
    }
};

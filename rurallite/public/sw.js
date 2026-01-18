// Service Worker for RuralLite - Offline First PWA
const CACHE_NAME = 'rurallite-v1.1'; // Increment version to force cache update
const RUNTIME_CACHE = 'rurallite-runtime';

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
    '/manifest.json',
    '/offline.html'
];

// Message handler for cache clearing
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        console.log('🗑️ [SW] Received cache clear command');
        event.waitUntil(
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        console.log('🗑️ [SW] Deleting cache:', cacheName);
                        return caches.delete(cacheName);
                    })
                );
            }).then(() => {
                console.log('✅ [SW] All caches cleared');
                // Notify client that cache is cleared
                self.clients.matchAll().then(clients => {
                    clients.forEach(client => {
                        client.postMessage({ type: 'CACHE_CLEARED' });
                    });
                });
            })
        );
    }

    if (event.data && event.data.type === 'SKIP_WAITING') {
        console.log('⚡ [SW] Skip waiting command received');
        self.skipWaiting();
    }
});

// Install event - cache critical assets
self.addEventListener('install', (event) => {
    console.log('🔧 [SW] Installing service worker...');
    console.log('📦 [SW] Assets to precache:', PRECACHE_ASSETS);
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('✅ [SW] Cache opened:', CACHE_NAME);
                console.log('📦 [SW] Starting to precache assets...');
                return cache.addAll(PRECACHE_ASSETS)
                    .then(() => {
                        console.log('✅ [SW] All assets precached successfully!');
                    })
                    .catch((err) => {
                        console.error('❌ [SW] Failed to precache assets:', err);
                        throw err;
                    });
            })
            .then(() => {
                console.log('⚡ [SW] Skipping waiting, activating immediately...');
                return self.skipWaiting();
            })
            .catch((err) => {
                console.error('❌ [SW] Install failed:', err);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('🔓 [SW] Activating service worker...');
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                console.log('📋 [SW] All cache names:', cacheNames);
                const oldCaches = cacheNames.filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE);
                console.log('🗑️ [SW] Old caches to delete:', oldCaches);
                return Promise.all(
                    oldCaches.map((name) => {
                        console.log('🗑️ [SW] Deleting old cache:', name);
                        return caches.delete(name);
                    })
                );
            })
            .then(() => {
                console.log('✅ [SW] Taking control of all clients...');
                return self.clients.claim();
            })
            .then(() => {
                console.log('✅ [SW] Service worker activated and ready!');
            })
    );
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip cross-origin requests
    if (url.origin !== location.origin) {
        return;
    }

    // API requests - network first, cache fallback
    if (url.pathname.startsWith('/api/')) {
        console.log('🌐 [SW] API request:', url.pathname);
        event.respondWith(
            fetch(request)
                .then((response) => {
                    console.log('✅ [SW] Network response for', url.pathname, '- Status:', response.status);
                    // Cache successful GET API responses only (Cache API doesn't support POST/PUT/DELETE)
                    if (response.ok && request.method === 'GET') {
                        const clonedResponse = response.clone();
                        caches.open(RUNTIME_CACHE).then((cache) => {
                            console.log('💾 [SW] Caching API response:', url.pathname);
                            cache.put(request, clonedResponse);
                        });
                    }
                    return response;
                })
                .catch((err) => {
                    console.log('❌ [SW] Network failed for', url.pathname, '- Trying cache...');
                    // Return cached response if network fails
                    return caches.match(request)
                        .then((cachedResponse) => {
                            if (cachedResponse) {
                                console.log('✅ [SW] Serving from cache:', url.pathname);
                                return cachedResponse;
                            }
                            console.log('❌ [SW] No cache available for:', url.pathname);
                            // Return offline response
                            return new Response(
                                JSON.stringify({ success: false, message: 'Offline - cached data not available' }),
                                { headers: { 'Content-Type': 'application/json' } }
                            );
                        });
                })
        );
        return;
    }

    // Static assets - cache first, network fallback
    console.log('📄 [SW] Static request:', url.pathname);
    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    console.log('✅ [SW] Serving from cache:', url.pathname);
                    return cachedResponse;
                }

                console.log('🌐 [SW] Not in cache, fetching:', url.pathname);
                return fetch(request)
                    .then((response) => {
                        console.log('✅ [SW] Network response for', url.pathname, '- Status:', response.status);
                        // Cache successful GET responses only (Cache API doesn't support POST/PUT/DELETE)
                        if (response.ok && request.method === 'GET') {
                            const clonedResponse = response.clone();
                            caches.open(RUNTIME_CACHE).then((cache) => {
                                console.log('💾 [SW] Caching:', url.pathname);
                                cache.put(request, clonedResponse);
                            });
                        }
                        return response;
                    })
                    .catch(() => {
                        // Return offline page for navigation requests
                        if (request.mode === 'navigate') {
                            return caches.match('/offline.html');
                        }
                        return new Response('Offline', { status: 503 });
                    });
            })
    );
});

// Background sync for offline data
self.addEventListener('sync', (event) => {
    console.log('[SW] Background sync:', event.tag);

    if (event.tag === 'sync-data') {
        event.waitUntil(syncOfflineData());
    }
});

async function syncOfflineData() {
    try {
        console.log('[SW] Syncing offline data...');
        // This will be handled by the IndexedDB manager
        // Send message to clients to trigger sync
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({ type: 'SYNC_REQUIRED' });
        });
    } catch (error) {
        console.error('[SW] Sync failed:', error);
    }
}

// Handle messages from clients
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

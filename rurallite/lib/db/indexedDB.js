// IndexedDB wrapper for offline data storage
const DB_NAME = 'RuralLiteDB';
const DB_VERSION = 1;

const STORES = {
    LESSONS: 'lessons',
    QUIZZES: 'quizzes',
    NOTES: 'notes',
    PROGRESS: 'progress',
    SYNC_QUEUE: 'syncQueue'
};

class IndexedDBManager {
    constructor() {
        this.db = null;
        this.initPromise = null;
        this.isInitializing = false;
    }

    async init() {
        // Return existing promise if already initializing
        if (this.initPromise) {
            return this.initPromise;
        }

        // Return existing db if already initialized
        if (this.db) {
            return this.db;
        }

        // Create new initialization promise
        this.isInitializing = true;
        this.initPromise = new Promise((resolve, reject) => {
            if (typeof window === 'undefined' || !window.indexedDB) {
                reject(new Error('IndexedDB not available'));
                return;
            }

            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => {
                this.initPromise = null;
                this.isInitializing = false;
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                this.isInitializing = false;

                // Handle unexpected close
                this.db.onclose = () => {
                    console.warn('IndexedDB connection closed unexpectedly');
                    this.db = null;
                    this.initPromise = null;
                };

                // Handle version change (from another tab)
                this.db.onversionchange = () => {
                    this.db.close();
                    this.db = null;
                    this.initPromise = null;
                };

                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Create object stores if they don't exist
                if (!db.objectStoreNames.contains(STORES.LESSONS)) {
                    const lessonStore = db.createObjectStore(STORES.LESSONS, { keyPath: 'id' });
                    lessonStore.createIndex('title', 'title', { unique: false });
                    lessonStore.createIndex('subject', 'subject', { unique: false });
                }

                if (!db.objectStoreNames.contains(STORES.QUIZZES)) {
                    const quizStore = db.createObjectStore(STORES.QUIZZES, { keyPath: 'id' });
                    quizStore.createIndex('title', 'title', { unique: false });
                }

                if (!db.objectStoreNames.contains(STORES.NOTES)) {
                    const noteStore = db.createObjectStore(STORES.NOTES, { keyPath: 'id', autoIncrement: true });
                    noteStore.createIndex('createdAt', 'createdAt', { unique: false });
                }

                if (!db.objectStoreNames.contains(STORES.PROGRESS)) {
                    const progressStore = db.createObjectStore(STORES.PROGRESS, { keyPath: 'id', autoIncrement: true });
                    progressStore.createIndex('lessonId', 'lessonId', { unique: false });
                }

                if (!db.objectStoreNames.contains(STORES.SYNC_QUEUE)) {
                    const syncStore = db.createObjectStore(STORES.SYNC_QUEUE, { keyPath: 'id', autoIncrement: true });
                    syncStore.createIndex('timestamp', 'timestamp', { unique: false });
                }
            };
        });

        return this.initPromise;
    }

    async getAll(storeName) {
        try {
            if (!this.db || this.db.objectStoreNames.length === 0) {
                await this.init();
            }

            // Check if db is still valid
            if (!this.db) {
                throw new Error('Database connection not available');
            }

            return new Promise((resolve, reject) => {
                try {
                    const transaction = this.db.transaction(storeName, 'readonly');
                    const store = transaction.objectStore(storeName);
                    const request = store.getAll();

                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error);
                    transaction.onerror = () => reject(transaction.error);
                } catch (error) {
                    // If transaction fails due to closed connection, retry once
                    if (error.name === 'InvalidStateError') {
                        this.db = null;
                        this.initPromise = null;
                        reject(new Error('Database connection closed, please retry'));
                    } else {
                        reject(error);
                    }
                }
            });
        } catch (error) {
            console.error('IndexedDB getAll error:', error);
            return [];
        }
    }

    async get(storeName, key) {
        try {
            if (!this.db || this.db.objectStoreNames.length === 0) {
                await this.init();
            }

            if (!this.db) {
                throw new Error('Database connection not available');
            }

            return new Promise((resolve, reject) => {
                try {
                    const transaction = this.db.transaction(storeName, 'readonly');
                    const store = transaction.objectStore(storeName);
                    const request = store.get(key);

                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error);
                    transaction.onerror = () => reject(transaction.error);
                } catch (error) {
                    if (error.name === 'InvalidStateError') {
                        this.db = null;
                        this.initPromise = null;
                        reject(new Error('Database connection closed, please retry'));
                    } else {
                        reject(error);
                    }
                }
            });
        } catch (error) {
            console.error('IndexedDB get error:', error);
            return null;
        }
    }

    async add(storeName, data) {
        try {
            if (!this.db || this.db.objectStoreNames.length === 0) {
                await this.init();
            }

            if (!this.db) {
                throw new Error('Database connection not available');
            }

            return new Promise((resolve, reject) => {
                try {
                    const transaction = this.db.transaction(storeName, 'readwrite');
                    const store = transaction.objectStore(storeName);
                    const request = store.add(data);

                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error);
                    transaction.onerror = () => reject(transaction.error);
                } catch (error) {
                    if (error.name === 'InvalidStateError') {
                        this.db = null;
                        this.initPromise = null;
                        reject(new Error('Database connection closed, please retry'));
                    } else {
                        reject(error);
                    }
                }
            });
        } catch (error) {
            console.error('IndexedDB add error:', error);
            throw error;
        }
    }

    async put(storeName, data) {
        try {
            if (!this.db || this.db.objectStoreNames.length === 0) {
                await this.init();
            }

            if (!this.db) {
                throw new Error('Database connection not available');
            }

            return new Promise((resolve, reject) => {
                try {
                    const transaction = this.db.transaction(storeName, 'readwrite');
                    const store = transaction.objectStore(storeName);
                    const request = store.put(data);

                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error);
                    transaction.onerror = () => reject(transaction.error);
                } catch (error) {
                    if (error.name === 'InvalidStateError') {
                        this.db = null;
                        this.initPromise = null;
                        reject(new Error('Database connection closed, please retry'));
                    } else {
                        reject(error);
                    }
                }
            });
        } catch (error) {
            console.error('IndexedDB put error:', error);
            throw error;
        }
    }

    async delete(storeName, key) {
        try {
            if (!this.db || this.db.objectStoreNames.length === 0) {
                await this.init();
            }

            if (!this.db) {
                throw new Error('Database connection not available');
            }

            return new Promise((resolve, reject) => {
                try {
                    const transaction = this.db.transaction(storeName, 'readwrite');
                    const store = transaction.objectStore(storeName);
                    const request = store.delete(key);

                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error);
                    transaction.onerror = () => reject(transaction.error);
                } catch (error) {
                    if (error.name === 'InvalidStateError') {
                        this.db = null;
                        this.initPromise = null;
                        reject(new Error('Database connection closed, please retry'));
                    } else {
                        reject(error);
                    }
                }
            });
        } catch (error) {
            console.error('IndexedDB delete error:', error);
            throw error;
        }
    }

    async clear(storeName) {
        try {
            if (!this.db || this.db.objectStoreNames.length === 0) {
                await this.init();
            }

            if (!this.db) {
                throw new Error('Database connection not available');
            }

            return new Promise((resolve, reject) => {
                try {
                    const transaction = this.db.transaction(storeName, 'readwrite');
                    const store = transaction.objectStore(storeName);
                    const request = store.clear();

                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error);
                    transaction.onerror = () => reject(transaction.error);
                } catch (error) {
                    if (error.name === 'InvalidStateError') {
                        this.db = null;
                        this.initPromise = null;
                        reject(new Error('Database connection closed, please retry'));
                    } else {
                        reject(error);
                    }
                }
            });
        } catch (error) {
            console.error('IndexedDB clear error:', error);
            throw error;
        }
    }

    async addToSyncQueue(action, data) {
        try {
            const syncItem = {
                action,
                data,
                timestamp: new Date().toISOString(),
                synced: false
            };
            return await this.add(STORES.SYNC_QUEUE, syncItem);
        } catch (error) {
            console.error('Error adding to sync queue:', error);
            return null;
        }
    }

    async getSyncQueue() {
        try {
            const items = await this.getAll(STORES.SYNC_QUEUE);
            return (items || []).filter(item => !item.synced);
        } catch (error) {
            console.error('Error getting sync queue:', error);
            return [];
        }
    }

    async markSynced(id) {
        try {
            const item = await this.get(STORES.SYNC_QUEUE, id);
            if (item) {
                item.synced = true;
                await this.put(STORES.SYNC_QUEUE, item);
            }
        } catch (error) {
            console.error('Error marking item as synced:', error);
        }
    }
}

// Export singleton instance
export const dbManager = new IndexedDBManager();
export { STORES };

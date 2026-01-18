/**
 * Development Logger Utility
 * Logs messages only in development mode, silent in production
 */

const isDev = process.env.NODE_ENV === 'development';

export const devLog = (...args) => {
    if (isDev && typeof console !== 'undefined') {
        console.log(...args);
    }
};

export const devError = (...args) => {
    if (isDev && typeof console !== 'undefined') {
        console.error(...args);
    }
};

export const devWarn = (...args) => {
    if (isDev && typeof console !== 'undefined') {
        console.warn(...args);
    }
};

export const devInfo = (...args) => {
    if (isDev && typeof console !== 'undefined') {
        console.info(...args);
    }
};

// For client-side conditional logging
export const clientDevLog = (...args) => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
        console.log(...args);
    }
};

export const clientDevError = (...args) => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
        console.error(...args);
    }
};

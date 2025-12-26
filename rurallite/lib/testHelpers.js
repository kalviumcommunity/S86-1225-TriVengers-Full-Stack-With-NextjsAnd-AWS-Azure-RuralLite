/**
 * Test Helper for Error & Loading States
 * 
 * Use these utilities to simulate loading delays and errors
 * for testing your loading.js and error.js components.
 */

/**
 * Simulate a delay (for testing loading states)
 * Usage in your page component:
 * 
 * import { simulateDelay } from '@/lib/testHelpers';
 * await simulateDelay(3000); // 3 second delay
 */
export const simulateDelay = (ms = 2000) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Simulate a random error (for testing error boundaries)
 * Usage in your page component:
 * 
 * import { simulateError } from '@/lib/testHelpers';
 * simulateError(0.5); // 50% chance of error
 */
export const simulateError = (probability = 0.3) => {
    if (Math.random() < probability) {
        throw new Error('Simulated error for testing error boundary');
    }
};

/**
 * Simulate API failure
 * Usage in your fetch calls:
 * 
 * import { simulateAPIFailure } from '@/lib/testHelpers';
 * if (simulateAPIFailure()) throw new Error('API request failed');
 */
export const simulateAPIFailure = (probability = 0.3) => {
    return Math.random() < probability;
};

/**
 * Network delay simulator for SWR/fetch testing
 * Usage with fetch:
 * 
 * import { withNetworkDelay } from '@/lib/testHelpers';
 * const data = await withNetworkDelay(fetch('/api/users'));
 */
export const withNetworkDelay = async (promise, delay = 2000) => {
    await simulateDelay(delay);
    return promise;
};

/**
 * Enable/disable test mode via localStorage
 * Usage in browser console:
 * 
 * localStorage.setItem('testMode', 'true');
 * localStorage.setItem('testDelay', '3000');
 * localStorage.setItem('testErrorRate', '0.5');
 */
export const isTestMode = () => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('testMode') === 'true';
};

export const getTestDelay = () => {
    if (typeof window === 'undefined') return 0;
    return parseInt(localStorage.getItem('testDelay') || '2000', 10);
};

export const getTestErrorRate = () => {
    if (typeof window === 'undefined') return 0;
    return parseFloat(localStorage.getItem('testErrorRate') || '0.3');
};

/**
 * Example usage in a page component:
 * 
 * import { isTestMode, getTestDelay, simulateDelay, simulateError } from '@/lib/testHelpers';
 * 
 * export default async function Page() {
 *   if (isTestMode()) {
 *     await simulateDelay(getTestDelay());
 *     simulateError(getTestErrorRate());
 *   }
 *   
 *   // Your normal page code...
 * }
 */

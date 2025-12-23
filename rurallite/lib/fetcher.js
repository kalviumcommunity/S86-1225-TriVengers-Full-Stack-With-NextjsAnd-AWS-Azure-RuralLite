/**
 * Fetcher utility for SWR
 * Handles API requests with authentication and error handling
 */

export const fetcher = async (url) => {
    // Get auth token from localStorage if available
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(url, {
        headers,
        credentials: 'include', // Include cookies for authentication
    });

    if (!res.ok) {
        const error = new Error('Failed to fetch data');
        error.status = res.status;

        try {
            const errorData = await res.json();
            error.info = errorData;
            error.message = errorData.message || error.message;
        } catch (e) {
            // Response is not JSON
        }

        throw error;
    }

    return res.json();
};

/**
 * Fetcher with custom method support (POST, PUT, DELETE)
 */
export const fetcherWithMethod = (method = 'GET') => async (url, body = null) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    };

    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (body && method !== 'GET') {
        options.body = JSON.stringify(body);
    }

    const res = await fetch(url, options);

    if (!res.ok) {
        const error = new Error('Request failed');
        error.status = res.status;

        try {
            const errorData = await res.json();
            error.info = errorData;
            error.message = errorData.message || error.message;
        } catch (e) {
            // Response is not JSON
        }

        throw error;
    }

    return res.json();
};

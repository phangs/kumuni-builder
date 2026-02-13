/**
 * API Fetch Wrapper with Automatic Token Refresh
 * 
 * This utility wraps the native fetch API to automatically handle token refresh
 * when a 401 Unauthorized response is received.
 */

const API_BASE_URL = import.meta.env.VITE_BUILDER_API_BASE_URL;

interface FetchWithAuthOptions extends RequestInit {
    skipAuthRefresh?: boolean; // Skip automatic token refresh for this request
}

/**
 * Refresh the access token using the refresh token
 */
async function refreshAccessToken(): Promise<string | null> {
    const refreshToken = localStorage.getItem('kumuni-refresh-token');

    if (!refreshToken) {
        console.warn('No refresh token available');
        return null;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/developer/refresh`, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                refresh_token: refreshToken
            }),
        });

        if (!response.ok) {
            throw new Error('Token refresh failed');
        }

        const data = await response.json();

        if (data.success && data.data?.access_token) {
            const { access_token, refresh_token: newRefreshToken } = data.data;

            // Update tokens in localStorage
            localStorage.setItem('kumuni-token', access_token);
            if (newRefreshToken) {
                localStorage.setItem('kumuni-refresh-token', newRefreshToken);
            }

            console.log('Token refreshed successfully via interceptor');
            return access_token;
        }

        return null;
    } catch (error) {
        console.error('Token refresh error:', error);
        return null;
    }
}

/**
 * Enhanced fetch with automatic token refresh on 401 errors
 */
export async function fetchWithAuth(
    url: string,
    options: FetchWithAuthOptions = {}
): Promise<Response> {
    const { skipAuthRefresh, ...fetchOptions } = options;

    // Add authorization header if token exists
    const token = localStorage.getItem('kumuni-token');
    if (token && !fetchOptions.headers) {
        fetchOptions.headers = {
            'Authorization': `Bearer ${token}`,
            'accept': 'application/json',
        };
    } else if (token && fetchOptions.headers) {
        (fetchOptions.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    // Make the initial request
    let response = await fetch(url, fetchOptions);

    // If we get a 401 and haven't disabled auto-refresh, try to refresh the token
    if (response.status === 401 && !skipAuthRefresh) {
        console.log('Received 401, attempting token refresh...');

        const newToken = await refreshAccessToken();

        if (newToken) {
            // Retry the request with the new token
            if (fetchOptions.headers) {
                (fetchOptions.headers as Record<string, string>)['Authorization'] = `Bearer ${newToken}`;
            }

            response = await fetch(url, fetchOptions);
            console.log('Request retried with refreshed token');
        } else {
            // Token refresh failed, clear auth data and redirect to login
            console.error('Token refresh failed, logging out');
            localStorage.removeItem('kumuni-user');
            localStorage.removeItem('kumuni-token');
            localStorage.removeItem('kumuni-refresh-token');

            // Redirect to login page
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
    }

    return response;
}

/**
 * Convenience wrapper for GET requests
 */
export async function apiGet(url: string, options?: FetchWithAuthOptions): Promise<Response> {
    return fetchWithAuth(url, { ...options, method: 'GET' });
}

/**
 * Convenience wrapper for POST requests
 */
export async function apiPost(
    url: string,
    body?: any,
    options?: FetchWithAuthOptions
): Promise<Response> {
    return fetchWithAuth(url, {
        ...options,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
        body: body ? JSON.stringify(body) : undefined,
    });
}

/**
 * Convenience wrapper for PATCH requests
 */
export async function apiPatch(
    url: string,
    body?: any,
    options?: FetchWithAuthOptions
): Promise<Response> {
    return fetchWithAuth(url, {
        ...options,
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
        body: body ? JSON.stringify(body) : undefined,
    });
}

/**
 * Convenience wrapper for DELETE requests
 */
export async function apiDelete(url: string, options?: FetchWithAuthOptions): Promise<Response> {
    return fetchWithAuth(url, { ...options, method: 'DELETE' });
}

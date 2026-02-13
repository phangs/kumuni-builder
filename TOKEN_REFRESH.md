# Automatic Token Refresh Implementation

## Overview
The application now includes automatic token refresh functionality to maintain user sessions seamlessly. This prevents users from being logged out when their access token expires.

## How It Works

### 1. **Automatic Refresh Scheduling**
- When a user logs in, the system decodes the JWT access token to determine its expiration time
- A timer is automatically scheduled to refresh the token **5 minutes before it expires**
- This ensures the user never experiences an interruption in their session

### 2. **Token Storage**
The system stores three pieces of information in localStorage:
- `kumuni-token` - The JWT access token (short-lived, ~24 hours)
- `kumuni-refresh-token` - The refresh token (long-lived, ~7 days)
- `kumuni-user` - User information decoded from the JWT

### 3. **Refresh Process**
When it's time to refresh:
1. The system calls `POST /developer/refresh` with the refresh token
2. Receives a new access token (and optionally a new refresh token)
3. Updates localStorage with the new tokens
4. Schedules the next refresh
5. Updates user data with any changes

### 4. **Automatic Retry on 401 Errors**
The `fetchWithAuth` utility automatically:
- Intercepts 401 Unauthorized responses
- Attempts to refresh the token
- Retries the original request with the new token
- Redirects to login if refresh fails

## API Integration

### Login Response Format
The login endpoint should return:
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGci...",
    "refresh_token": "eyJhbGci..."
  }
}
```

### Refresh Endpoint
**Endpoint**: `POST /developer/refresh`

**Request**:
```json
{
  "refresh_token": "eyJhbGci..."
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGci...",
    "refresh_token": "eyJhbGci..." // Optional: new refresh token
  }
}
```

## Usage

### Using the API Wrapper (Recommended)

Instead of using `fetch` directly, use the provided API utilities:

```typescript
import { apiGet, apiPost, apiPatch, apiDelete } from '@/utils/api';

// GET request
const response = await apiGet(`${API_BASE_URL}/admin/miniapps/reviews`);
const data = await response.json();

// POST request
const response = await apiPost(
  `${API_BASE_URL}/admin/developers/${id}/approve`,
  { reason: 'Approved' }
);

// PATCH request
const response = await apiPatch(
  `${API_BASE_URL}/builder/miniapps/${id}`,
  { name: 'Updated Name' }
);

// DELETE request
const response = await apiDelete(`${API_BASE_URL}/builder/miniapps/${id}`);
```

### Manual Token Refresh

You can also manually trigger a token refresh:

```typescript
import { useAuth } from '@/contexts/AuthContext';

const { refreshToken } = useAuth();

// Manually refresh the token
const success = await refreshToken();
if (success) {
  console.log('Token refreshed successfully');
}
```

### Using Regular Fetch (Not Recommended)

If you need to use regular `fetch`, you should still use the wrapper:

```typescript
import { fetchWithAuth } from '@/utils/api';

const response = await fetchWithAuth(`${API_BASE_URL}/some/endpoint`, {
  method: 'GET',
  headers: {
    'Custom-Header': 'value'
  }
});
```

## Migration Guide

To update existing API calls to use automatic token refresh:

### Before:
```typescript
const token = localStorage.getItem('kumuni-token');
const response = await fetch(`${API_BASE_URL}/admin/miniapps/reviews`, {
  headers: {
    'accept': 'application/json',
    'Authorization': `Bearer ${token}`
  }
});
```

### After:
```typescript
import { apiGet } from '@/utils/api';

const response = await apiGet(`${API_BASE_URL}/admin/miniapps/reviews`);
```

## Benefits

1. **Seamless User Experience**: Users stay logged in without interruption
2. **Automatic Retry**: Failed requests due to expired tokens are automatically retried
3. **Centralized Logic**: Token management is handled in one place
4. **Security**: Refresh tokens are stored separately and have longer expiration
5. **Error Handling**: Automatic logout and redirect when refresh fails

## Token Lifecycle

```
Login
  ↓
Store access_token + refresh_token
  ↓
Schedule refresh (5 min before expiry)
  ↓
Timer triggers → Call /developer/refresh
  ↓
Update tokens → Schedule next refresh
  ↓
(Repeat until logout or refresh fails)
```

## Error Scenarios

### Scenario 1: Refresh Token Expired
- User is automatically logged out
- Redirected to login page
- All tokens cleared from localStorage

### Scenario 2: Network Error During Refresh
- Refresh is retried on next API call
- If still failing, user is logged out

### Scenario 3: Invalid Refresh Token
- User is logged out immediately
- Redirected to login page

## Testing

To test the token refresh:

1. **Simulate Token Expiry**:
   - Modify the refresh timer to trigger sooner (e.g., 10 seconds)
   - Watch console logs for "Token refreshed successfully"

2. **Test 401 Handling**:
   - Manually expire the access token in localStorage
   - Make an API call
   - Verify it automatically refreshes and retries

3. **Test Refresh Failure**:
   - Remove the refresh token from localStorage
   - Make an API call
   - Verify user is redirected to login

## Console Logs

The system logs important events:
- `Token refresh scheduled in X minutes` - When refresh is scheduled
- `Token refreshed successfully` - When refresh succeeds
- `Received 401, attempting token refresh...` - When intercepting 401
- `Request retried with refreshed token` - When retry succeeds
- `Token refresh failed, logging out` - When refresh fails

## Future Enhancements

Potential improvements:
1. Add retry logic for failed refresh attempts
2. Implement token refresh queue to prevent multiple simultaneous refreshes
3. Add refresh token rotation for enhanced security
4. Implement silent refresh in background worker
5. Add telemetry for token refresh success/failure rates

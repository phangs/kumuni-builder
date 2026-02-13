import React, { ReactNode, useEffect, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string; user?: any }>;
  register: (userData: { email: string; password: string; fullName: string; company: string }) => Promise<boolean>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const API_BASE_URL = import.meta.env.VITE_BUILDER_API_BASE_URL;

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);
  const [user, setUser] = React.useState<any>(null);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Function to schedule token refresh
  const scheduleTokenRefresh = (accessToken: string) => {
    try {
      const decoded: any = jwtDecode(accessToken);
      const expiresAt = decoded.exp * 1000; // Convert to milliseconds
      const now = Date.now();
      const timeUntilExpiry = expiresAt - now;

      // Refresh 5 minutes before expiry (or immediately if less than 5 minutes left)
      const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 0);

      // Clear any existing timer
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }

      // Schedule refresh
      refreshTimerRef.current = setTimeout(() => {
        refreshToken();
      }, refreshTime);

      console.log(`Token refresh scheduled in ${Math.round(refreshTime / 1000 / 60)} minutes`);
    } catch (error) {
      console.error('Error scheduling token refresh:', error);
    }
  };

  // Function to refresh the access token
  const refreshToken = async (): Promise<boolean> => {
    const storedRefreshToken = localStorage.getItem('kumuni-refresh-token');

    if (!storedRefreshToken) {
      console.warn('No refresh token available');
      logout();
      return false;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/developer/refresh`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: storedRefreshToken
        }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();

      if (data.success && data.data?.access_token) {
        const { access_token, refresh_token } = data.data;

        // Update tokens in localStorage
        localStorage.setItem('kumuni-token', access_token);
        if (refresh_token) {
          localStorage.setItem('kumuni-refresh-token', refresh_token);
        }

        // Decode and update user data
        try {
          const decoded: any = jwtDecode(access_token);
          const updatedUser = {
            ...user,
            id: decoded.sub,
            email: decoded.email,
            fullName: decoded.fullName || decoded.name || user?.fullName || 'Developer',
            company: decoded.company || user?.company || 'Kumuni',
            role: decoded.role,
            ...decoded
          };

          localStorage.setItem('kumuni-user', JSON.stringify(updatedUser));
          setUser(updatedUser);
        } catch (e) {
          console.warn('Could not decode refreshed token:', e);
        }

        // Schedule next refresh
        scheduleTokenRefresh(access_token);

        console.log('Token refreshed successfully');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      logout();
      return false;
    }
  };

  // Initialize auth state and set up token refresh on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('kumuni-user');
    const token = localStorage.getItem('kumuni-token');
    const refreshTokenStored = localStorage.getItem('kumuni-refresh-token');

    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);

        // Schedule token refresh
        scheduleTokenRefresh(token);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        // Clear invalid data
        localStorage.removeItem('kumuni-user');
        localStorage.removeItem('kumuni-token');
        localStorage.removeItem('kumuni-refresh-token');
      }
    }

    // Cleanup timer on unmount
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string; user?: any }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/developer/login`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          message: data.message || 'Login failed. Please check your credentials.'
        };
      }

      // Successful login
      const { access_token, refresh_token } = data.data;

      // Decode token to get user info
      let userData: any = { email };
      try {
        const decoded: any = jwtDecode(access_token);
        userData = {
          ...userData,
          id: decoded.sub,
          fullName: decoded.fullName || decoded.name || 'Developer',
          company: decoded.company || 'Kumuni',
          role: decoded.role, // Explicitly extract role
          ...decoded
        };
      } catch (e) {
        console.warn('Could not decode token:', e);
      }

      localStorage.setItem('kumuni-user', JSON.stringify(userData));
      localStorage.setItem('kumuni-token', access_token);

      // Store refresh token if provided
      if (refresh_token) {
        localStorage.setItem('kumuni-refresh-token', refresh_token);
      }

      setUser(userData);
      setIsAuthenticated(true);

      // Schedule token refresh
      scheduleTokenRefresh(access_token);

      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'An error occurred during login. Please try again later.'
      };
    }
  };

  const register = async (userData: { email: string; password: string; fullName: string; company: string }): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/developer/register`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          fullName: userData.fullName,
          company: userData.company,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Registration failed:', errorData);
        return false;
      }

      const data = await response.json();

      // Registration successful, but account requires admin approval.
      // We do NOT set user state or tokens here.

      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    // Clear refresh timer
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }

    // Clear stored data
    localStorage.removeItem('kumuni-user');
    localStorage.removeItem('kumuni-token');
    localStorage.removeItem('kumuni-refresh-token');

    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
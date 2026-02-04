import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: { email: string; password: string; firstName: string; lastName: string }) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is already logged in (from localStorage or session storage)
    const storedUser = localStorage.getItem('kumuni-user');
    const token = localStorage.getItem('kumuni-token');
    
    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        // Clear invalid data
        localStorage.removeItem('kumuni-user');
        localStorage.removeItem('kumuni-token');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call to login
    // In a real app, this would be an actual API call
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // For demo purposes, accept any email/password combination
      // In a real app, this would validate credentials with the backend
      const mockUser = {
        id: 'user-' + Date.now(),
        email,
        firstName: 'Demo',
        lastName: 'User',
        createdAt: new Date().toISOString()
      };
      
      // Store user data and token
      localStorage.setItem('kumuni-user', JSON.stringify(mockUser));
      localStorage.setItem('kumuni-token', 'demo-token-' + Date.now());
      
      setUser(mockUser);
      setIsAuthenticated(true);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (userData: { email: string; password: string; firstName: string; lastName: string }): Promise<boolean> => {
    // Simulate API call to register
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any registration
      // In a real app, this would send registration data to the backend
      const mockUser = {
        id: 'user-' + Date.now(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        createdAt: new Date().toISOString()
      };
      
      // Store user data and token
      localStorage.setItem('kumuni-user', JSON.stringify(mockUser));
      localStorage.setItem('kumuni-token', 'demo-token-' + Date.now());
      
      setUser(mockUser);
      setIsAuthenticated(true);
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    // Clear stored data
    localStorage.removeItem('kumuni-user');
    localStorage.removeItem('kumuni-token');
    
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
import React, { createContext, useContext, ReactNode } from 'react';

// Define the shape of our theme
interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  destructive: string;
  background: string;
  foreground: string;
  muted: string;
  border: string;
  input: string;
  ring: string;
}

interface ThemeContextType {
  colorScheme: ColorScheme;
  toggleTheme: () => void;
  isDark: boolean;
}

// Create the context with default values
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Default light theme colors based on the tailwind config
const defaultLightColors: ColorScheme = {
  primary: '#030213',
  secondary: '#468B97',
  accent: '#F3AA60',
  destructive: '#EF6262',
  background: '#ffffff',
  foreground: '#030213',
  muted: '#f1f5f9',
  border: '#e2e8f0',
  input: '#f8fafc',
  ring: '#030213',
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // For now, we'll just use the default light theme
  // In a real implementation, you might want to allow toggling between themes
  const [isDark, setIsDark] = React.useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const colorScheme = defaultLightColors;

  const value = {
    colorScheme,
    toggleTheme,
    isDark,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
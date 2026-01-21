import React, { createContext, useContext, ReactNode } from 'react';
import { Toaster, toast } from 'sonner';

interface ToastContextType {
  toast: typeof toast;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <Toaster position="bottom-right" richColors />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
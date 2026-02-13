import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import PreviewPage from './PreviewPage';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { MyAppsPage } from './components/MyAppsPage';
import { ProfilePage } from './components/ProfilePage';
import { SettingsPage } from './components/SettingsPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RoleBasedRedirect } from './components/RoleBasedRedirect';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminReviewPage } from './components/AdminReviewPage';
import { DevelopersPage } from './components/DevelopersPage';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

const AppWrapper: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/" element={<RoleBasedRedirect />} />

              {/* Protected Routes */}
              <Route path="/builder/:id?" element={<ProtectedRoute><App /></ProtectedRoute>} />
              <Route path="/preview" element={<ProtectedRoute><PreviewPage /></ProtectedRoute>} />
              <Route path="/my-apps" element={<ProtectedRoute><MyAppsPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/review/:id" element={<ProtectedRoute><AdminReviewPage /></ProtectedRoute>} />
              <Route path="/admin/developers" element={<ProtectedRoute><DevelopersPage /></ProtectedRoute>} />


              <Route path="*" element={<RoleBasedRedirect />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>,
);
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * RoleBasedRedirect component
 * Redirects users to their appropriate home page based on their role
 */
export const RoleBasedRedirect: React.FC = () => {
    const { user, isAuthenticated } = useAuth();

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Redirect based on user role
    if (user?.role === 'Admin') {
        return <Navigate to="/admin/dashboard" replace />;
    }

    // Default redirect for regular users
    return <Navigate to="/my-apps" replace />;
};

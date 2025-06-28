import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const cookieValue = parts.pop()?.split(';').shift() || null;
      return cookieValue;
    }
    return null;
  };

  const isAuthenticated = !!localStorage.getItem('authToken') || !!getCookie('authToken');
  console.log('Checking authentication:', { isAuthenticated });

  if (!isAuthenticated) {
    console.log('Redirecting to login from protected route');
    return <Navigate to="/login" state={{ fromProtectedRoute: true, from: window.location.pathname }} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
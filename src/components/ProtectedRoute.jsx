import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  // If no token exists in storage, redirect to login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
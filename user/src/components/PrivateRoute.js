import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthState } from '../hooks/useAuthState';

const PrivateRoute = ({ children }) => {
  const { user, role } = useAuthState();

  if (!user) return <Navigate to="/admin/login" />;
  if (role !== 'admin') return <Navigate to="/home" />;

  return children;
};

export default PrivateRoute;

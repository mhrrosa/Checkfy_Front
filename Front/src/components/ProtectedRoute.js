import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

const ProtectedRoute = ({ children }) => {
  const { userType } = useContext(UserContext);

  if (!userType) {
    return <Navigate to="/login-cadastro" replace />;
  }
  return children; // Se estiver logado, renderiza a rota normalmente
};

export default ProtectedRoute;
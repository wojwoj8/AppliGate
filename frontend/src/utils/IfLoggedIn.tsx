import { Navigate } from 'react-router-dom';
import React, { useState, ReactNode, useContext } from 'react';
import AuthContext from './AuthProvider';

interface IfLoggedInProps {
  children: ReactNode;
}

const IfLoggedIn: React.FC<IfLoggedInProps> = ({ children, ...rest }): React.ReactElement => {
  let { user } = useContext(AuthContext);

  return user ? <Navigate to='/'/> : <>{children}</>;
};

export default IfLoggedIn;
import { FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { getCookie } from '../../utils/cookie';

type ProtectedRouteProps = {
  children: ReactNode;
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const accessToken = getCookie('accessToken');
  const isAuthenticated = Boolean(accessToken);

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  return <>{children}</>;
};

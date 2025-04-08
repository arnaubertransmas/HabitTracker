import { useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

interface ProtectedRouteProps {
  children: ReactNode;
}

// define protected route for routes.tsx
function ProtectedRoute({ children }: ProtectedRouteProps) {
  const redirect = useNavigate();
  const isAuthenticated = Cookies.get('cookie_access_token');

  useEffect(() => {
    if (!isAuthenticated) {
      redirect('/signin');
    }
  }, [isAuthenticated, redirect]);

  // If authenticated, render the children components
  return isAuthenticated ? <>{children}</> : null;
}

export default ProtectedRoute;

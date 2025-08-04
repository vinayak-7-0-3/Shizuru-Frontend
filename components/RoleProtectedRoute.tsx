import { useAuth } from '../lib/auth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'premium' | 'user';
  fallback?: React.ReactNode;
}

export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ 
  children, 
  requiredRole = 'user',
  fallback = <div>Access denied</div>
}) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Basic auth is already handled by middleware
  // This component only handles role-based access
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    // This shouldn't happen if middleware is working correctly
    router.push('/login');
    return null;
  }

  // Check if user has required role (you'd add this to your user object)
  if (requiredRole === 'admin' && user.role !== 'admin') {
    return <>{fallback}</>;
  }

  if (requiredRole === 'premium' && !['premium', 'admin'].includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
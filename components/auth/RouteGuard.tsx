"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { usePermissions } from '@/hooks/usePermissions';
import { PermissionRequirement } from '@/lib/permissions';
type UserRole = 'admin' | 'participant' | 'mentor' | 'judge'

interface RouteGuardProps {
  children: React.ReactNode;
  requiredPermission?: PermissionRequirement;
  requiredRole?: UserRole | UserRole[] | string;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export function RouteGuard({
  children,
  requiredPermission,
  requiredRole,
  redirectTo = '/',
  fallback = <div className="flex items-center justify-center min-h-screen">جاري التحميل...</div>
}: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading: authLoading, checkAuth } = useAuth();
  const { hasPermission, hasRole, loading: permissionsLoading } = usePermissions();
  const [authorized, setAuthorized] = useState(false);
  const [redirectAttempts, setRedirectAttempts] = useState(0);

  // Function to clear auth cookies
  const clearAuthCookies = async () => {
    try {
      // Call logout endpoint to clear server-side session/cookies
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
      console.log('🍪 RouteGuard - Auth cookies cleared');
    } catch (error) {
      console.error('Error clearing auth cookies:', error);
    }
  };

  useEffect(() => {
    // Reset redirect attempts when pathname changes
    if (pathname !== '/login') {
      setRedirectAttempts(0);
    }

    const authCheck = async () => {
      // Prevent infinite redirect loops
      if (redirectAttempts > 2) {
        console.log('⚠️ RouteGuard - Too many redirect attempts, clearing auth state');
        await clearAuthCookies();
        setAuthorized(false);
        return;
      }

      // Wait for auth and permissions to load
      if (authLoading || permissionsLoading) return;

      // Check if user is authenticated
      if (!user) {
        console.log('❌ RouteGuard - No user found, redirecting to login');
        await clearAuthCookies();
        setRedirectAttempts(prev => prev + 1);
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      // Check role requirement
      if (requiredRole) {
        const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
        if (!roles.includes(user.role)) {
          console.log(`❌ RouteGuard - User role ${user.role} doesn't match required roles: ${roles.join(', ')}`);
          setRedirectAttempts(prev => prev + 1);
          router.push(redirectTo);
          return;
        }
      }

      // Check permission requirement
      if (requiredPermission && !hasPermission(requiredPermission)) {
        console.log(`❌ RouteGuard - User lacks required permission: ${JSON.stringify(requiredPermission)}`);
        setRedirectAttempts(prev => prev + 1);
        router.push(redirectTo);
        return;
      }

      // User is authorized
      console.log('✅ RouteGuard - User authorized');
      setAuthorized(true);
    };

    // Check authentication on route change
    authCheck();
  }, [
    user,
    authLoading,
    permissionsLoading,
    hasPermission,
    hasRole,
    requiredPermission,
    requiredRole,
    router,
    redirectTo,
    pathname,
    redirectAttempts,
    checkAuth
  ]);

  // Show loading state
  if (authLoading || permissionsLoading || !authorized) {
    return <>{fallback}</>;
  }

  // User is authorized, render children
  return <>{children}</>;
}

/**
 * Higher-order component for protecting pages
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    requiredPermission?: PermissionRequirement;
    requiredRole?: UserRole | UserRole[];
    redirectTo?: string;
  }
) {
  return function ProtectedComponent(props: P) {
    return (
      <RouteGuard {...options}>
        <Component {...props} />
      </RouteGuard>
    );
  };
}

/**
 * Hook for checking authorization in components
 */
export function useAuthorization(
  requiredPermission?: PermissionRequirement,
  requiredRole?: UserRole | UserRole[]
) {
  const { user } = useAuth();
  const { hasPermission, hasRole } = usePermissions();

  const isAuthorized = () => {
    if (!user) return false;
    
    if (requiredRole && !hasRole(requiredRole)) return false;
    
    if (requiredPermission && !hasPermission(requiredPermission)) return false;
    
    return true;
  };

  return {
    isAuthorized: isAuthorized(),
    user,
    hasPermission,
    hasRole
  };
}

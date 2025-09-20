'use client';

import { useRouter } from 'next/navigation';
import { useToast } from '../../components/ui/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { useState, useCallback } from 'react';

export const useAuthErrorHandler = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { logout } = useAuth();
  const [redirectAttempts, setRedirectAttempts] = useState(0);

  // Function to clear auth cookies
  const clearAuthCookies = useCallback(async () => {
    try {
      // Call logout endpoint to clear server-side session/cookies
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
      console.log('🍪 AuthErrorHandler - Auth cookies cleared');
    } catch (error) {
      console.error('Error clearing auth cookies:', error);
    }
  }, []);

  // Function to check and handle authentication errors
  const checkAndHandleAuthError = useCallback(async (error: any) => {
    // Check if the error is an authentication error (401)
    const isAuthError = error?.status === 401 || 
                        error?.response?.status === 401 || 
                        error?.message?.includes('token') ||
                        error?.message?.includes('غير مصرح');

    if (isAuthError) {
      console.log('🔒 AuthErrorHandler - Authentication error detected:', error);
      
      // Prevent infinite redirect loops
      if (redirectAttempts > 2) {
        console.log('⚠️ AuthErrorHandler - Too many redirect attempts, clearing auth state');
        await clearAuthCookies();
        return;
      }

      // Clear auth cookies
      await clearAuthCookies();
      
      // Call the logout function from auth context to clear client-side state
      logout();
      
      // Show toast notification
      toast({
        title: "انتهت الجلسة",
        description: "انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى.",
        variant: "destructive",
      });
      
      // Increment redirect attempts
      setRedirectAttempts(prev => prev + 1);
      
      // Redirect to login page
      router.push('/login');
      return true;
    }
    
    return false;
  }, [clearAuthCookies, logout, redirectAttempts, router, toast]);

  return { checkAndHandleAuthError };
};

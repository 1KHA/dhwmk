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

  // Function to check and handle authentication errors
  const checkAndHandleAuthError = useCallback(async (error: any) => {
    // Check if the error is an authentication error (401)
    // We specifically check for 401 status or token-related messages
    // We exclude 403 errors which indicate permission issues, not authentication issues
    const isAuthError = error?.status === 401 || 
                        error?.response?.status === 401 || 
                        (error?.message?.includes('token') && !error?.message?.includes('Invalid role')) ||
                        (error?.message?.includes('غير مصرح') && !error?.message?.includes('Invalid role'));

    if (isAuthError) {
      console.log('🔒 AuthErrorHandler - Authentication error detected:', error);
      
      // Prevent infinite redirect loops
      if (redirectAttempts > 2) {
        console.log('⚠️ AuthErrorHandler - Too many redirect attempts, stopping redirect');
        return;
      }
      
      // Call the logout function from auth context to clear client-side state and cookies
      // This will make a single call to /api/logout instead of multiple calls
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
  }, [logout, redirectAttempts, router, toast]);

  return { checkAndHandleAuthError };
};

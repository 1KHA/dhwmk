"use client";

import { useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useToast } from "../../../components/ui/use-toast";
import { useAuthErrorHandler } from "@/hooks/useAuthErrorHandler";

interface ParticipantRouteGuardProps {
  children: ReactNode;
}

export default function ParticipantRouteGuard({ children }: ParticipantRouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const { checkAndHandleAuthError } = useAuthErrorHandler();
  const [authorized, setAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [redirectAttempts, setRedirectAttempts] = useState(0);

  // Function to clear auth cookies
  const clearAuthCookies = async () => {
    try {
      // Call logout endpoint to clear server-side session/cookies
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
      console.log('🍪 ParticipantRouteGuard - Auth cookies cleared');
    } catch (error) {
      console.error('Error clearing auth cookies:', error);
    }
  };

  useEffect(() => {
    // Reset redirect attempts when pathname changes
    if (pathname !== '/login') {
      setRedirectAttempts(0);
    }

    // Authentication check function
    const authCheck = async () => {
      try {
        // Prevent infinite redirect loops
        if (redirectAttempts > 2) {
          console.log('⚠️ ParticipantRouteGuard - Too many redirect attempts, clearing auth state');
          await clearAuthCookies();
          setIsLoading(false);
          setAuthorized(false);
          return;
        }

        // Check if user is authenticated as participant
        const response = await fetch('/api/participant/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include cookies
        });

        console.log('🔍 ParticipantRouteGuard - Response status:', response.status);

        if (!response.ok) {
          console.log('❌ ParticipantRouteGuard - Response not OK:', response.status, response.statusText);
          
          // Clear auth cookies on 401 Unauthorized
          if (response.status === 401) {
            await clearAuthCookies();
          }
          
          throw new Error('غير مصرح - لا يوجد token');
        }

        const data = await response.json();
        
        console.log('🔍 ParticipantRouteGuard - Response data:', data);
        
        // Verify the user is a participant
        if (data && data.role === 'participant') {
          console.log('✅ ParticipantRouteGuard - Participant authorization successful');
          setAuthorized(true);
        } else {
          console.log('❌ ParticipantRouteGuard - Authorization failed:', data);
          await clearAuthCookies();
          throw new Error('غير مصرح. هذه الخدمة متاحة للمشاركين فقط.');
        }
      } catch (error: any) {
        setAuthorized(false);
        
        // Use the auth error handler to handle the error
        const handled = await checkAndHandleAuthError(error);
        
        if (!handled) {
          // If not handled by the auth error handler, show a toast
          toast({
            title: "خطأ في الصلاحيات",
            description: error.message || "غير مصرح. هذه الخدمة متاحة للمشاركين فقط.",
            variant: "destructive",
          });
          
          // Increment redirect attempts and redirect to login
          setRedirectAttempts(prev => prev + 1);
          router.push("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Check authentication on route change
    authCheck();
  }, [pathname, router, toast, redirectAttempts, checkAndHandleAuthError]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">جاري التحقق من صلاحيات المشارك...</p>
        </div>
      </div>
    );
  }

  // If not authorized, show nothing (will redirect)
  if (!authorized) {
    return null;
  }

  // If authorized, render children
  return <>{children}</>;
}

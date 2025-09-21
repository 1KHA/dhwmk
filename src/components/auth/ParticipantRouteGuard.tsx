"use client";

import { useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useToast } from "../../../components/ui/use-toast";
import { useAuthErrorHandler } from "@/hooks/useAuthErrorHandler";
import { useAuth } from "@/contexts/auth-context";

interface ParticipantRouteGuardProps {
  children: ReactNode;
}

export default function ParticipantRouteGuard({ children }: ParticipantRouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const { logout } = useAuth();
  const { checkAndHandleAuthError } = useAuthErrorHandler();
  const [authorized, setAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [redirectAttempts, setRedirectAttempts] = useState(0);

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
          console.log('⚠️ ParticipantRouteGuard - Too many redirect attempts, stopping redirect');
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
          
          // Handle 401 Unauthorized in the catch block
          
          throw new Error('غير مصرح - لا يوجد token');
        }

        const data = await response.json();
        
        console.log('🔍 ParticipantRouteGuard - Response data:', data);
        
        // Log the full response data for debugging
        console.log('🔍 ParticipantRouteGuard - Full response data:', JSON.stringify(data));
        
        // Verify the user is a participant
        // If the role field is missing but we have a valid participant ID, assume it's a participant
        if (data && (data.role === 'participant' || (data.id && !data.role))) {
          console.log('✅ ParticipantRouteGuard - Participant authorization successful');
          setAuthorized(true);
        } else {
          console.log('❌ ParticipantRouteGuard - Authorization failed:', data);
          // Use a specific error message for role issues (403) vs authentication issues (401)
          throw new Error('Invalid role: ' + (data.role || 'unknown') + ' (expected: participant)');
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
  }, [pathname, router, toast, redirectAttempts, checkAndHandleAuthError, logout]);

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

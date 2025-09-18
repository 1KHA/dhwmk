"use client";

import { useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useToast } from "../../../components/ui/use-toast";

interface AdminRouteGuardProps {
  children: ReactNode;
}

export default function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
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
      console.log('🍪 AdminRouteGuard - Auth cookies cleared');
    } catch (error) {
      console.error('Error clearing auth cookies:', error);
    }
  };

  useEffect(() => {
    // Reset redirect attempts when pathname changes
    if (pathname !== '/admin-login') {
      setRedirectAttempts(0);
    }

    // Authentication check function
    const authCheck = async () => {
      try {
        // Prevent infinite redirect loops
        if (redirectAttempts > 2) {
          console.log('⚠️ AdminRouteGuard - Too many redirect attempts, clearing auth state');
          await clearAuthCookies();
          setIsLoading(false);
          setAuthorized(false);
          return;
        }

        // Check if user is authenticated as admin
        const response = await fetch('/api/admin/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include cookies
        });

        console.log('🔍 AdminRouteGuard - Response status:', response.status);

        if (!response.ok) {
          console.log('❌ AdminRouteGuard - Response not OK:', response.status, response.statusText);
          
          // Clear auth cookies on 401 Unauthorized
          if (response.status === 401) {
            await clearAuthCookies();
          }
          
          throw new Error('غير مصرح. هذه الخدمة متاحة للمسؤولين فقط.');
        }

        const data = await response.json();
        
        console.log('🔍 AdminRouteGuard - Response data:', data);
        
        // Verify the user is an admin (updated to match new response format)
        if (data.success && data.role === 'admin') {
          console.log('✅ AdminRouteGuard - Admin authorization successful');
          setAuthorized(true);
        } else {
          console.log('❌ AdminRouteGuard - Authorization failed:', { success: data.success, role: data.role });
          await clearAuthCookies();
          throw new Error('غير مصرح. هذه الخدمة متاحة للمسؤولين فقط.');
        }
      } catch (error: any) {
        setAuthorized(false);
        toast({
          title: "خطأ في الصلاحيات",
          description: error.message || "غير مصرح. هذه الخدمة متاحة للمسؤولين فقط.",
          variant: "destructive",
        });
        
        // Increment redirect attempts and redirect to login
        setRedirectAttempts(prev => prev + 1);
        router.push("/admin-login");
      } finally {
        setIsLoading(false);
      }
    };

    // Check authentication on route change
    authCheck();
  }, [pathname, router, toast, redirectAttempts]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">جاري التحقق من صلاحيات المسؤول...</p>
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

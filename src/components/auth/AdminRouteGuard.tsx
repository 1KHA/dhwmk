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

  useEffect(() => {
    // Authentication check function
    const authCheck = async () => {
      try {
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
          throw new Error('غير مصرح. هذه الخدمة متاحة للمسؤولين فقط.');
        }
      } catch (error: any) {
        setAuthorized(false);
        toast({
          title: "خطأ في الصلاحيات",
          description: error.message || "غير مصرح. هذه الخدمة متاحة للمسؤولين فقط.",
          variant: "destructive",
        });
        router.push("/admin-login");
      } finally {
        setIsLoading(false);
      }
    };

    // Check authentication on route change
    authCheck();
  }, [pathname, router, toast]);

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

"use client";

import { useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

interface RouteGuardProps {
  children: ReactNode;
}

export default function RouteGuard({ children }: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Authentication check function
    const authCheck = () => {
      // For demo purposes, we'll consider the user as authenticated
      // In a real application, you would check for a token or session
      const isAuthenticated = true; // Mock authentication status
      
      if (!isAuthenticated) {
        // If not authenticated, redirect to login
        setAuthorized(false);
        router.push("/login");
      } else {
        // If authenticated, set authorized to true
        setAuthorized(true);
      }
    };

    // Check authentication on route change
    authCheck();
  }, [pathname, router]);

  // Show loading or nothing while checking authentication
  if (!authorized) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    );
  }

  // If authorized, render children
  return <>{children}</>;
}

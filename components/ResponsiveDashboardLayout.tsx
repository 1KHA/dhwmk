"use client";

import React from "react";
import { useResponsive } from "@/contexts/responsive-context";
import MobileNavigation from "./MobileNavigation";

interface ResponsiveDashboardLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  topbar: React.ReactNode;
  mobileNavItems: Array<{
    name: string;
    href: string;
    icon: React.ElementType;
    permission?: { category: string; action: string };
    showWhen?: string;
  }>;
  logo?: React.ReactNode;
  userRole?: string;
}

export default function ResponsiveDashboardLayout({
  children,
  sidebar,
  topbar,
  mobileNavItems,
  logo,
  userRole,
}: ResponsiveDashboardLayoutProps) {
  const { isMobile } = useResponsive();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Show topbar on all devices */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {topbar}
      </div>

      <div className="flex flex-1">
        {/* Show sidebar only on desktop */}
        {!isMobile && (
          <div className="hidden md:flex md:w-64 md:flex-col">
            <div className="flex flex-col flex-grow pt-5 overflow-y-auto border-r">
              {sidebar}
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile navigation at the bottom */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t py-2">
          <MobileNavigation 
            items={mobileNavItems} 
            logo={logo}
            userRole={userRole}
          />
        </div>
      )}
    </div>
  );
}

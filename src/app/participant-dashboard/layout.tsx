"use client";

import { useState, useEffect } from "react";
import Sidebar from "../../../components/participant/Sidebar";
import TopBar from "../../../components/participant/TopBar";
import { RouteGuard } from "../../../components/auth/RouteGuard";

export default function ParticipantDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <RouteGuard 
      requiredRole="participant"
      redirectTo="/login"
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-[#620F10]">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-lg">جاري التحقق من صحة تسجيل الدخول...</p>
          </div>
        </div>
      }
    >
      <div className="min-h-screen bg-background">
        <TopBar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6 mr-64">
            {children}
          </main>
        </div>
      </div>
    </RouteGuard>
  );
}

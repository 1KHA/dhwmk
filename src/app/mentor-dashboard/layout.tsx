"use client";

import { useState, useEffect } from "react";
import Sidebar from "../../../components/mentor/Sidebar";
import TopBar from "../../../components/mentor/TopBar";

export default function MentorDashboardLayout({
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
    <div className="min-h-screen bg-background">
      <TopBar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 mr-64">
          {children}
        </main>
      </div>
    </div>
  );
}

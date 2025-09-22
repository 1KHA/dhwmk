"use client";

import dynamic from 'next/dynamic';
import { ResponsiveProvider } from "@/contexts/responsive-context";

// Dynamically import the responsive page component
const ResponsiveTeamsPage = dynamic(
  () => import('./responsive-page'),
  { 
    ssr: false,
    loading: () => <div className="flex justify-center items-center h-64">جاري التحميل...</div>
  }
);

export default function TeamsPage() {
  return (
    <ResponsiveProvider>
      <ResponsiveTeamsPage />
    </ResponsiveProvider>
  );
}

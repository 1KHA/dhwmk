"use client";

import dynamic from "next/dynamic";
import { ResponsiveProvider } from "@/contexts/responsive-context";

// Dynamically import the responsive page component
const ResponsiveTeamPage = dynamic(() => import("./responsive-page"), {
  ssr: false,
  loading: () => <div className="p-8 text-center">Loading...</div>,
});

// Wrap the responsive page with the ResponsiveProvider
export default function TeamManagementPage() {
  return (
    <ResponsiveProvider>
      <ResponsiveTeamPage />
    </ResponsiveProvider>
  );
}

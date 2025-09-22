"use client";

import { useState, useEffect } from "react";
import { 
  Home, 
  Calendar, 
  Users, 
  UserCheck,
  BookOpen,
  Flag
} from "lucide-react";
import Sidebar from "../../../components/hackathon-admin/AdminHacktonSidebar";
import TopBar from "@/components/hackathon-admin/TopBar";
import { AdminToaster } from "@/components/admin/admin-toaster";
import AdminRouteGuard from "@/components/auth/AdminRouteGuard";
import ResponsiveDashboardLayout from "../../../components/ResponsiveDashboardLayout";
import { ResponsiveProvider } from "@/contexts/responsive-context";

// Define navigation items for both sidebar and mobile navigation
const navItems = [
  { name: "لوحة التحكم", href: "/admin-hackton-dashboard", icon: Home },
  { name: "الفعاليات", href: "/admin-hackton-dashboard/events", icon: Calendar },
  { name: "المشاركون", href: "/admin-hackton-dashboard/participants", icon: Users },
  { name: "الفرق", href: "/admin-hackton-dashboard/teams", icon: UserCheck },
  { name: "المرشدون", href: "/admin-hackton-dashboard/mentors", icon: BookOpen },
  { name: "التسليمات", href: "/admin-hackton-dashboard/milestones", icon: Flag },
];

export default function AdminDashboardLayout({
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
    <AdminRouteGuard>
      <ResponsiveProvider>
        <ResponsiveDashboardLayout
          sidebar={<Sidebar />}
          topbar={<TopBar />}
          mobileNavItems={navItems}
          userRole="مدير الهاكاثون"
          logo={<span className="text-xl font-bold">إدارة الهاكاثون</span>}
        >
          {children}
          <AdminToaster />
        </ResponsiveDashboardLayout>
      </ResponsiveProvider>
    </AdminRouteGuard>
  );
}

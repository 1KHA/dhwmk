"use client";

import { useState, useEffect } from "react";
import { Home, Users, Flag, Star, Book, Calendar } from "lucide-react";
import Sidebar from "../../../components/participant/Sidebar";
import TopBar from "../../../components/participant/TopBar";
import ParticipantRouteGuard from "@/components/auth/ParticipantRouteGuard";
import ResponsiveDashboardLayout from "../../../components/ResponsiveDashboardLayout";
import { ResponsiveProvider } from "@/contexts/responsive-context";

// Define navigation items for both sidebar and mobile navigation
const navItems = [
  { 
    name: "لوحة التحكم", 
    href: "/participant-dashboard", 
    icon: Home,
    permission: { category: 'dashboard', action: 'view' }
  },
  { 
    name: "فريقي", 
    href: "/participant-dashboard/team", 
    icon: Flag,
    permission: { category: 'users', action: 'view' },
    showWhen: 'hasTeam' // Only show when participant has a team
  },
  { 
    name: "الفرق", 
    href: "/participant-dashboard/teams", 
    icon: Users,
    permission: { category: 'users', action: 'view' },
    showWhen: 'noTeam' // Only show when participant doesn't have a team
  },
  { 
    name: "التسليمات", 
    href: "/participant-dashboard/milestones", 
    icon: Star,
    permission: { category: 'startups', action: 'view' }
  },
  { 
    name: "الموجهون", 
    href: "/participant-dashboard/mentors", 
    icon: Book,
    permission: { category: 'mentorship', action: 'view' }
  },
  { 
    name: "الفعاليات", 
    href: "/participant-dashboard/events", 
    icon: Calendar,
    permission: { category: 'events', action: 'view' }
  }
];

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
    <ParticipantRouteGuard>
      <ResponsiveProvider>
        <ResponsiveDashboardLayout
          sidebar={<Sidebar />}
          topbar={<TopBar />}
          mobileNavItems={navItems}
          userRole="المشارك"
          logo={<span className="text-xl font-bold">منصة دِيَم</span>}
        >
          {children}
        </ResponsiveDashboardLayout>
      </ResponsiveProvider>
    </ParticipantRouteGuard>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  UserPlus,
  Trophy,
  Calendar,
  FileText,
  Settings,
  Bell,
  Award,
  Home,
  BarChart,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  submenu?: NavItem[];
  expanded?: boolean;
}

export default function Sidebar() {
  const pathname = usePathname();
  const [navItems, setNavItems] = useState<NavItem[]>([
    {
      title: "لوحة التحكم",
      href: "/admin-hackton-dashboard",
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: "المشاركون",
      href: "/admin-hackton-dashboard/participants",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "الفرق",
      href: "/admin-hackton-dashboard/teams",
      icon: <UserPlus className="h-5 w-5" />,
    },
    {
      title: "الحكام",
      href: "/admin-hackton-dashboard/judges",
      icon: <Trophy className="h-5 w-5" />,
    },
    {
      title: "الموجهون",
      href: "/admin-hackton-dashboard/mentors",
      icon: <Award className="h-5 w-5" />,
    },
    {
      title: "الفعاليات",
      href: "/admin-hackton-dashboard/events",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      title: "المشاريع المقدمة",
      href: "/admin-hackton-dashboard/submissions",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "التحليلات",
      href: "/admin-hackton-dashboard/analytics",
      icon: <BarChart className="h-5 w-5" />,
    },
    {
      title: "الإشعارات",
      href: "/admin-hackton-dashboard/notifications",
      icon: <Bell className="h-5 w-5" />,
    },
  ]);

  const toggleSubmenu = (index: number) => {
    const updatedNavItems = [...navItems];
    updatedNavItems[index].expanded = !updatedNavItems[index].expanded;
    setNavItems(updatedNavItems);
  };

  const isActive = (href: string) => {
    if (href === "/admin-hackton-dashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r bg-background p-4 overflow-y-auto">
      <div className="space-y-1">
        {navItems.map((item, index) => (
          <div key={item.href} className="mb-1">
            {item.submenu ? (
              <>
                <button
                  onClick={() => toggleSubmenu(index)}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium ${
                    isActive(item.href)
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center">
                    {item.icon}
                    <span className="mr-2">{item.title}</span>
                  </div>
                  {item.expanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                {item.expanded && item.submenu && (
                  <div className="mr-4 mt-1 space-y-1 border-r pr-4">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                          isActive(subItem.href)
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        }`}
                      >
                        {subItem.icon}
                        <span className="mr-2">{subItem.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                href={item.href}
                className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                  isActive(item.href)
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                {item.icon}
                <span className="mr-2">{item.title}</span>
              </Link>
            )}
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-4 w-full pr-8">
        <div className="rounded-md bg-muted p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium">مركز المساعدة</h4>
              <p className="text-xs text-muted-foreground">
                هل تحتاج إلى مساعدة؟
              </p>
            </div>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
}

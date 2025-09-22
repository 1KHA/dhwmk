"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { usePermissions } from "@/hooks/usePermissions";

interface MobileNavigationProps {
  items: Array<{
    name: string;
    href: string;
    icon: React.ElementType;
    permission?: { category: string; action: string };
    showWhen?: string;
  }>;
  logo?: React.ReactNode;
  userRole?: string;
}

export default function MobileNavigation({
  items,
  logo,
  userRole,
}: MobileNavigationProps) {
  const pathname = usePathname();
  const { hasPermission } = usePermissions();

  // Filter items based on permissions
  const filteredItems = items.filter((item) => {
    if (item.permission) {
      return hasPermission(item.permission);
    }
    return true;
  });

  return (
    <div className="flex items-center justify-around px-2">
      {filteredItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center p-2 rounded-md transition-colors",
              isActive
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-primary hover:bg-primary/5"
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="text-xs mt-1">{item.name}</span>
          </Link>
        );
      })}
      
      {userRole && (
        <div className="flex flex-col items-center justify-center p-2">
          <span className="text-xs text-muted-foreground">{userRole}</span>
        </div>
      )}
    </div>
  );
}

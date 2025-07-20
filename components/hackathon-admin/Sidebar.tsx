"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Calendar, 
  FileText, 
  Users, 
  UserCheck,
  Trophy,
  BookOpen,
  BarChart3,
  Bell
} from "lucide-react";

const navItems = [
  { name: "لوحة التحكم", href: "/hackathon-admin-dashboard", icon: Home },
  { name: "المشاركون", href: "/hackathon-admin-dashboard/participants", icon: Users },
  { name: "الفرق", href: "/hackathon-admin-dashboard/teams", icon: UserCheck },
  { name: "الحكام", href: "/hackathon-admin-dashboard/judges", icon: Trophy },
  { name: "الموجهون", href: "/hackathon-admin-dashboard/mentors", icon: BookOpen },
  { name: "المشاريع المقدمة", href: "/hackathon-admin-dashboard/submissions", icon: FileText },
  { name: "الفعاليات", href: "/hackathon-admin-dashboard/events", icon: Calendar },
  { name: "التحليلات", href: "/hackathon-admin-dashboard/analytics", icon: BarChart3 },
  { name: "الإشعارات", href: "/hackathon-admin-dashboard/notifications", icon: Bell },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col" dir="rtl">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold">إدارة الهاكاثون</h2>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
              pathname === item.href
                ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <item.icon className="w-5 h-5 ml-3" />
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Search,
  Bell,
  Menu,
  X,
  User,
  LogOut,
  Settings,
  HelpCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { addToast } from "./admin-toaster";

export default function TopBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addToast(`تم البحث عن: ${searchQuery}`, "info");
      setSearchQuery("");
    }
  };

  const handleNotificationClick = () => {
    addToast("تم فتح الإشعارات", "info");
  };

  const handleLogout = () => {
    addToast("تم تسجيل الخروج بنجاح", "success");
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="mr-2 rounded-md p-2 text-muted-foreground hover:bg-muted md:hidden"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
            <span className="sr-only">القائمة</span>
          </button>

          <Link href="/admin-hackton-dashboard" className="flex items-center">
            <span className="text-xl font-bold">هاكثون</span>
            <span className="ml-1 rounded-md bg-primary px-1.5 py-0.5 text-xs font-medium text-primary-foreground">
              لوحة التحكم
            </span>
          </Link>
        </div>

        <div className="hidden md:flex md:flex-1 md:justify-center md:px-4">
          <form onSubmit={handleSearch} className="relative w-full max-w-md">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="بحث في لوحة التحكم..."
              className="w-full rounded-md border border-input bg-background py-2 pr-10 pl-4 text-right"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={handleNotificationClick}
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              3
            </span>
            <span className="sr-only">الإشعارات</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full border border-muted"
              >
                <User className="h-5 w-5" />
                <span className="sr-only">الملف الشخصي</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex flex-col space-y-1 p-2">
                <p className="text-sm font-medium">أحمد محمد</p>
                <p className="text-xs text-muted-foreground">
                  admin@example.com
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="ml-2 h-4 w-4" />
                <span>الملف الشخصي</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="ml-2 h-4 w-4" />
                <span>الإعدادات</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="ml-2 h-4 w-4" />
                <span>المساعدة</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="ml-2 h-4 w-4" />
                <span>تسجيل الخروج</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="border-t p-4 md:hidden">
          <form onSubmit={handleSearch} className="relative mb-4">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="بحث في لوحة التحكم..."
              className="w-full rounded-md border border-input bg-background py-2 pr-10 pl-4 text-right"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
      )}
    </header>
  );
}

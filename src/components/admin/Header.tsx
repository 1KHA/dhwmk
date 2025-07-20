"use client";

import { useState } from "react";
import { Bell, Search } from "lucide-react";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="flex justify-between items-center mb-6">
      <div className="relative">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <input
          type="text"
          placeholder="بحث..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-64 py-2 pr-10 pl-4 rounded-md border border-input bg-background text-right"
        />
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-muted">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
        </button>
        <div className="flex items-center gap-2">
          <div>
            <p className="text-sm font-medium text-right">أحمد محمد</p>
            <p className="text-xs text-muted-foreground text-right">مدير النظام</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
            أم
          </div>
        </div>
      </div>
    </header>
  );
}

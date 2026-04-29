import React, { useState } from 'react';
import * as Icons from 'lucide-react';

export function Header() {
  const [notificationCount] = useState(3);

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-[--card] border-b border-[--border] z-40 shadow-sm">
      <div className="h-full px-8 flex items-center justify-between">
        {/* Left: Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Icons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[--muted-foreground]" />
            <input
              type="text"
              placeholder="Buscar transacciones..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-[--border] bg-[--input] text-sm text-[--foreground] placeholder-[--muted-foreground] focus:outline-none focus:border-[--primary] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Right: Notifications & Avatar */}
        <div className="flex items-center gap-6 ml-8">
          {/* Notifications */}
          <button className="relative p-2 text-[--muted-foreground] hover:text-[--primary] hover:bg-[--muted] rounded-lg transition-colors duration-200">
            <Icons.Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>

          {/* Settings */}
          <button className="relative p-2 text-[--muted-foreground] hover:text-[--primary] hover:bg-[--muted] rounded-lg transition-colors duration-200">
            <Icons.Settings className="w-5 h-5" />
          </button>

          {/* Avatar */}
          <div className="flex items-center gap-3 pl-6 border-l border-[--border]">
            <div className="flex flex-col text-right">
              <p className="text-sm font-semibold text-[--foreground]">Admin</p>
              <p className="text-xs text-[--muted-foreground]">Administrador</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[--primary] to-[--secondary] flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-xs font-bold text-white">AD</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

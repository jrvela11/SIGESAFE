import React from 'react';
import * as Icons from 'lucide-react';
import { navItems } from '../../data/mockData';

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-[--border] flex flex-col shadow-sm">
      {/* Logo */}
      <div className="p-6 border-b border-[--border]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-[--primary] to-[--secondary] rounded-lg flex items-center justify-center shadow-sm">
            <Icons.Coffee className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-base font-bold text-[--foreground] leading-tight">Café & Cacao</h1>
            <p className="text-xs text-[--muted-foreground]">Admin</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {/* CORRECCIÓN 1: Agregamos ": any" al parámetro item */}
          {navItems.map((item: any) => {
            // CORRECCIÓN 2: Le decimos a TS que busque en Icons sin quejarse
            const IconComponent = (Icons as any)[item.icon];
            return (
              <li key={item.id}>
                <a
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-md text-[--foreground] hover:bg-[--primary] hover:text-white active:bg-[--secondary] transition-all duration-150 cursor-pointer group"
                >
                  {IconComponent && <IconComponent className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                  <span className="text-sm font-medium">{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[--border]">
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[--muted] hover:bg-[--border] transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[--primary] to-[--secondary] flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-white">AD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[--foreground] truncate">Admin</p>
            <p className="text-xs text-[--muted-foreground] truncate">admin@cafe.com</p>
          </div>
          <Icons.LogOut className="w-4 h-4 text-[--muted-foreground] cursor-pointer hover:text-[--primary] transition-colors flex-shrink-0" />
        </div>
      </div>
    </aside>
  );
}
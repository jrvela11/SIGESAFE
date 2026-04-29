import React from 'react';
import { Sidebar } from './Sidebar'; // CORRECCIÓN 1: Arreglamos la ruta del Sidebar
import { Header } from './Header';

// CORRECCIÓN 2: Agregamos ": any" a children
export function DashboardLayout({ children }: any) {
  return (
    <div className="flex h-screen bg-[--background]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header */}
        <Header />

        {/* Content Area */}
        <main className="flex-1 overflow-auto mt-16 p-8 bg-[--background]">
          {children}
        </main>
      </div>
    </div>
  );
}
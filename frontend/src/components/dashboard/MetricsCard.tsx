import React from 'react';
import * as Icons from 'lucide-react';

// AQUÍ LA CORRECCIÓN: Agregamos ": any" al final de las propiedades
export function MetricsCard({ title, value, change, icon, bgColor, textColor, borderColor }: any) {
  // Y aquí le decimos a TypeScript que busque el ícono sin quejarse
  const IconComponent = (Icons as any)[icon];
  const isPositive = !change?.includes('-');

  return (
    <div className="bg-[--card] border border-[--border] rounded-lg p-6 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold text-[--muted-foreground] uppercase tracking-wider mb-3">{title}</p>
          <div className="mb-4">
            <p className="text-3xl font-bold text-[--foreground]">{value}</p>
          </div>
          <div className="flex items-center gap-2">
            {isPositive ? (
              <>
                <Icons.TrendingUp className="w-4 h-4 text-green-600" />
                <p className="text-sm font-semibold text-green-600">{change}</p>
              </>
            ) : (
              <>
                <Icons.TrendingDown className="w-4 h-4 text-red-600" />
                <p className="text-sm font-semibold text-red-600">{change}</p>
              </>
            )}
            <p className="text-sm text-[--muted-foreground]">vs. mes anterior</p>
          </div>
        </div>
        {IconComponent && (
          <div className="p-3 rounded-lg bg-gradient-to-br from-[--primary] from-50% to-[--secondary] text-white shadow-sm">
            <IconComponent className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
}
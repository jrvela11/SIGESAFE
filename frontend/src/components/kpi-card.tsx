import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  badge?: {
    label: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };
}

export function KPICard({
  title,
  value,
  subtitle,
  icon,
  trend,
  badge,
}: KPICardProps) {
  return (
    <Card className="bg-white border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-800">
          {title}
        </CardTitle>
        {icon && <div className="text-[#C19A6B]">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-bold text-slate-800">{value}</div>
            {trend && (
              <span
                className={`text-sm font-medium ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend.isPositive ? '+' : '-'}{trend.value}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-gray-500">{subtitle}</p>
          )}
          {badge && (
            <Badge variant={badge.variant || 'secondary'} className="w-fit">
              {badge.label}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// AQUÍ LA CORRECCIÓN: Agregamos ": any" al parámetro
export function SalesChart({ data }: any) {
  return (
    <div className="bg-[--card] rounded-lg border border-[--border] p-6 col-span-2 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-[--foreground]">Trazabilidad vs Compras</h2>
        <p className="text-sm text-[--muted-foreground] mt-1">Comparativa mensual de actividades</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e8e4e0" vertical={false} />
          <XAxis dataKey="month" stroke="#7f7b77" style={{ fontSize: '12px' }} />
          <YAxis stroke="#7f7b77" style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e8e4e0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
            cursor={{ fill: 'rgba(193, 154, 107, 0.08)' }}
            labelStyle={{ color: '#1F1412' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Bar
            dataKey="trazabilidad"
            fill="#C19A6B"
            name="Trazabilidad"
            radius={[8, 8, 0, 0]}
          />
          <Bar
            dataKey="compras"
            fill="#8B5A2B"
            name="Compras"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
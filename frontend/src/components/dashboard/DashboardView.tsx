import React from 'react';
import { MetricsCard } from '././MetricsCard';
import { SalesChart } from '././SalesChart';
import { TransactionsTable } from '././TransactionsTable';
import { metrics, chartData, transactions } from './../../data/mockData';

export function DashboardView() {
  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-[--foreground] mb-2">Dashboard</h1>
        <p className="text-[--muted-foreground] text-base">Resumen general de operaciones de café y cacao</p>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* AQUÍ ESTÁ LA MAGIA: Le agregamos ": any" a metric */}
        {metrics.map((metric: any) => (
          <MetricsCard
            key={metric.id}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            icon={metric.icon}
            bgColor={metric.bgColor}
            textColor={metric.textColor}
            borderColor={metric.borderColor}
          />
        ))}
      </div>

      {/* Charts and Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sales Chart */}
        <SalesChart data={chartData} />

        {/* Transactions Table */}
        <TransactionsTable transactions={transactions} />
      </div>
    </div>
  );
}
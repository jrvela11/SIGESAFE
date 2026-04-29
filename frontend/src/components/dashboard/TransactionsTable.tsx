import React from 'react';
import * as Icons from 'lucide-react';

// CORRECCIÓN 1: Agregamos ": any" a transactions
export function TransactionsTable({ transactions }: any) {
  return (
    <div className="bg-[--card] rounded-lg border border-[--border] p-6 col-span-2 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-[--foreground]">Últimas Transacciones</h2>
          <p className="text-sm text-[--muted-foreground] mt-1">Actividad reciente de compras y ventas</p>
        </div>
        <button className="text-sm text-[--primary] hover:text-[--secondary] font-medium flex items-center gap-2 transition-colors">
          Ver todas
          <Icons.ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[--border]">
              <th className="text-left text-xs font-semibold text-[--muted-foreground] uppercase tracking-wider pb-4 pl-4">Descripción</th>
              <th className="text-left text-xs font-semibold text-[--muted-foreground] uppercase tracking-wider pb-4">Proveedor/Cliente</th>
              <th className="text-left text-xs font-semibold text-[--muted-foreground] uppercase tracking-wider pb-4">Monto</th>
              <th className="text-left text-xs font-semibold text-[--muted-foreground] uppercase tracking-wider pb-4">Estado</th>
              <th className="text-left text-xs font-semibold text-[--muted-foreground] uppercase tracking-wider pb-4">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {/* CORRECCIÓN 2: Agregamos ": any" a transaction */}
            {transactions.map((transaction: any) => (
              <tr key={transaction.id} className="border-b border-[--border] hover:bg-[--muted] transition-colors duration-150">
                <td className="py-4 pl-4 text-sm text-[--foreground] font-medium">{transaction.description}</td>
                <td className="py-4 text-sm text-[--muted-foreground]">{transaction.supplier}</td>
                <td className="py-4 text-sm font-semibold text-[--foreground]">{transaction.amount}</td>
                <td className="py-4">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${transaction.statusColor}`}>
                    {transaction.status}
                  </span>
                </td>
                <td className="py-4 text-sm text-[--muted-foreground]">{transaction.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
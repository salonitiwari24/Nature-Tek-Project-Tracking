import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    type: 'up' | 'down' | 'neutral';
  };
  isLoading?: boolean;
}

export function KPICard({ title, value, icon, trend, isLoading = false }: KPICardProps) {
  if (isLoading) {
    return (
      <div className="relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="h-4 w-28 animate-pulse rounded bg-zinc-200" />
          <div className="h-10 w-10 animate-pulse rounded-lg bg-zinc-100" />
        </div>
        <div className="mt-4 h-8 w-20 animate-pulse rounded bg-zinc-200" />
        <div className="mt-2 h-4 w-32 animate-pulse rounded bg-zinc-150" />
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-500">{title}</span>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-100">
          {icon}
        </div>
      </div>
      <div className="mt-2">
        <span className="text-3xl font-bold tracking-tight text-zinc-950">{value}</span>
      </div>
      {trend && (
        <div className="mt-2 flex items-center gap-1.5 text-xs font-medium">
          <span
            className={`flex items-center gap-0.5 rounded-full px-1.5 py-0.5 ${
              trend.type === 'up'
                ? 'bg-emerald-50 text-emerald-700'
                : trend.type === 'down'
                  ? 'bg-rose-50 text-rose-700'
                  : 'bg-zinc-50 text-zinc-600'
            }`}
          >
            {trend.type === 'up' && <ArrowUpRight className="h-3 w-3" />}
            {trend.type === 'down' && <ArrowDownRight className="h-3 w-3" />}
            {trend.type === 'neutral' && <Minus className="h-3 w-3" />}
            {trend.value}
          </span>
          <span className="text-zinc-400">vs last quarter</span>
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { ArrowUp, ArrowDown, HelpCircle } from 'lucide-react';

interface StreamlitMetricProps {
  label: string;
  value: string | number;
  delta?: string | number;
  deltaColor?: 'normal' | 'inverse' | 'off';
  help?: string;
  prefix?: string;
}

export const StreamlitMetric: React.FC<StreamlitMetricProps> = ({
  label,
  value,
  delta,
  deltaColor = 'normal',
  help,
  prefix,
}) => {
  const isPositive = typeof delta === 'string' 
    ? delta.startsWith('+') || !delta.startsWith('-')
    : typeof delta === 'number' && delta >= 0;

  // Determine delta badge color
  let colorClass = 'text-slate-500 dark:text-slate-400';
  if (deltaColor !== 'off' && delta !== undefined) {
    if (deltaColor === 'normal') {
      colorClass = isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400';
    } else if (deltaColor === 'inverse') {
      colorClass = isPositive ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400';
    }
  }

  return (
    <div className="flex flex-col rounded-lg border border-slate-200/80 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:border-slate-800 dark:bg-slate-900 transition-all hover:border-slate-300 dark:hover:border-slate-700">
      <div className="flex items-center justify-between gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
        <span className="truncate">{label}</span>
        {help && (
          <span title={help} className="cursor-help text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            <HelpCircle className="h-3 w-3" />
          </span>
        )}
      </div>

      <div className="mt-1.5 flex items-baseline gap-1">
        {prefix && <span className="text-xl font-semibold text-slate-700 dark:text-slate-300">{prefix}</span>}
        <span className="font-mono text-2xl font-bold tracking-tight text-slate-900 tabular-nums dark:text-white">
          {value}
        </span>
      </div>

      {delta !== undefined && (
        <div className={`mt-1 flex items-center gap-1 font-mono text-xs font-semibold tabular-nums ${colorClass}`}>
          {deltaColor !== 'off' && (
            isPositive ? <ArrowUp className="h-3 w-3 shrink-0" /> : <ArrowDown className="h-3 w-3 shrink-0" />
          )}
          <span>{delta}</span>
        </div>
      )}
    </div>
  );
};

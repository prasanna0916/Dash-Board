import React from 'react';
import { CustomerRecord } from '../../types';
import { ShieldCheck, ShieldAlert } from 'lucide-react';

interface SupportShieldChartProps {
  data: CustomerRecord[];
}

export const SupportShieldChart: React.FC<SupportShieldChartProps> = ({ data }) => {
  const categories = [
    { label: 'Fiber Optic (No Tech Support)', internet: 'Fiber optic', support: 'No' },
    { label: 'Fiber Optic (With Tech Support)', internet: 'Fiber optic', support: 'Yes' },
    { label: 'DSL (No Tech Support)', internet: 'DSL', support: 'No' },
    { label: 'DSL (With Tech Support)', internet: 'DSL', support: 'Yes' },
  ];

  const results = categories.map((cat) => {
    const subset = data.filter(
      (d) => d.internetService === cat.internet && d.techSupport === cat.support
    );
    const total = subset.length;
    const churned = subset.filter((d) => d.churn === 'Yes').length;
    const churnRate = total > 0 ? (churned / total) * 100 : 0;

    return {
      ...cat,
      total,
      churned,
      churnRate,
    };
  });

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[#ff4b4b] font-semibold">px.bar(barmode='group')</span>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              Tech Support as an Anti-Churn Shield on High-Speed Tiers
            </h4>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Key Insight: Fiber optic customers with Tech Support churn <span className="font-semibold text-emerald-600 dark:text-emerald-400">3x less</span> than unsupported users.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map((item) => {
          const isHighRisk = item.churnRate > 35;
          return (
            <div
              key={item.label}
              className={`rounded-lg border p-4 transition-all ${
                isHighRisk
                  ? 'border-rose-200 bg-rose-50/40 dark:border-rose-900/40 dark:bg-rose-950/20'
                  : 'border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/40 dark:bg-emerald-950/20'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5 font-medium text-xs text-slate-900 dark:text-white">
                    {isHighRisk ? (
                      <ShieldAlert className="h-4 w-4 text-[#ff4b4b]" />
                    ) : (
                      <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    )}
                    <span>{item.label}</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 font-mono">
                    Cohort Sample: {item.total} customers ({item.churned} churned)
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`font-mono text-xl font-bold tabular-nums ${
                      isHighRisk ? 'text-[#ff4b4b]' : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {item.churnRate.toFixed(1)}%
                  </span>
                  <p className="text-[10px] text-slate-400">Churn Rate</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className={`h-full transition-all duration-500 ${
                    isHighRisk ? 'bg-[#ff4b4b]' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, item.churnRate * 1.5)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 rounded-md bg-slate-50 p-3 text-xs text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
        <strong className="text-slate-800 dark:text-slate-100">Data Science Recommendation:</strong> Bundle 6 months of complimentary Tech Support with every Fiber Optic activation. The $10/mo support cost prevents a $95/mo customer churn event.
      </div>
    </div>
  );
};

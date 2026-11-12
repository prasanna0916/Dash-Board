import React from 'react';
import { CustomerRecord } from '../../types';

interface ChargesDistributionChartProps {
  data: CustomerRecord[];
}

export const ChargesDistributionChart: React.FC<ChargesDistributionChartProps> = ({ data }) => {
  // Buckets: $20-$40, $40-$60, $60-$80, $80-$100, $100-$125
  const buckets = [
    { label: '$20–$40', min: 20, max: 40 },
    { label: '$40–$60', min: 40, max: 60 },
    { label: '$60–$80', min: 60, max: 80 },
    { label: '$80–$100', min: 80, max: 100 },
    { label: '$100–$125', min: 100, max: 125 },
  ];

  const bucketStats = buckets.map((b) => {
    const subset = data.filter((d) => d.monthlyCharges >= b.min && d.monthlyCharges < b.max);
    const total = subset.length;
    const churned = subset.filter((d) => d.churn === 'Yes').length;
    const retained = total - churned;
    const churnRate = total > 0 ? (churned / total) * 100 : 0;

    return {
      ...b,
      total,
      churned,
      retained,
      churnRate,
    };
  });

  const maxCount = Math.max(...bucketStats.map((b) => b.total), 1);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[#ff4b4b] font-semibold">px.histogram(barmode='overlay')</span>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              Monthly Charges Distribution & Price Sensitivity Hotspots
            </h4>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Key Insight: Customers in the <span className="font-semibold text-slate-800 dark:text-slate-200">$70–$100/mo range</span> show acute churn sensitivity without value justification.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-[#ff4b4b]" />
            <span className="text-slate-600 dark:text-slate-400">Churned (Yes)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-slate-300 dark:bg-slate-600" />
            <span className="text-slate-600 dark:text-slate-400">Retained (No)</span>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {bucketStats.map((item) => {
          const churnWidth = (item.churned / maxCount) * 100;
          const retainedWidth = (item.retained / maxCount) * 100;

          return (
            <div key={item.label} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
                  {item.label}
                </span>
                <div className="flex items-center gap-3 font-mono text-xs tabular-nums">
                  <span className="text-slate-500">{item.total} customers</span>
                  <span className={`font-semibold ${item.churnRate > 30 ? 'text-[#ff4b4b]' : 'text-slate-700 dark:text-slate-300'}`}>
                    Churn: {item.churnRate.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Stacked comparison bar */}
              <div className="flex h-5 w-full overflow-hidden rounded bg-slate-100 dark:bg-slate-800/80">
                <div
                  className="bg-[#ff4b4b] h-full transition-all duration-300"
                  style={{ width: `${churnWidth}%` }}
                  title={`Churned: ${item.churned}`}
                />
                <div
                  className="bg-slate-300 dark:bg-slate-600 h-full transition-all duration-300"
                  style={{ width: `${retainedWidth}%` }}
                  title={`Retained: ${item.retained}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

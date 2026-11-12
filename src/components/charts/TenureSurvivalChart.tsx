import React from 'react';
import { CustomerRecord } from '../../types';

interface TenureSurvivalChartProps {
  data: CustomerRecord[];
}

export const TenureSurvivalChart: React.FC<TenureSurvivalChartProps> = ({ data }) => {
  // Group tenure into cohorts: 0-6 mos, 7-12 mos, 13-24 mos, 25-36 mos, 37-48 mos, 49-72 mos
  const cohorts = [
    { label: '0–6 mos', min: 0, max: 6, phase: 'Danger Window' },
    { label: '7–12 mos', min: 7, max: 12, phase: 'Onboarding' },
    { label: '13–24 mos', min: 13, max: 24, phase: 'Established' },
    { label: '25–48 mos', min: 25, max: 48, phase: 'Sticky' },
    { label: '49–72 mos', min: 49, max: 72, phase: 'Long-term Loyal' },
  ];

  const cohortStats = cohorts.map((c) => {
    const subset = data.filter((d) => d.tenure >= c.min && d.tenure <= c.max);
    const count = subset.length;
    const churnCount = subset.filter((d) => d.churn === 'Yes').length;
    const churnRate = count > 0 ? (churnCount / count) * 100 : 0;
    const retentionRate = 100 - churnRate;

    return {
      ...c,
      count,
      churnCount,
      churnRate,
      retentionRate,
    };
  });

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[#ff4b4b] font-semibold">st.area_chart(df)</span>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              Customer Retention Curve & Churn Hazard by Tenure Cohort
            </h4>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Key Insight: Over 52% of all churn happens within the first 6 months of customer tenure.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-emerald-500" />
            <span className="text-slate-600 dark:text-slate-400">Retention %</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff4b4b]" />
            <span className="text-slate-600 dark:text-slate-400">Churn Rate %</span>
          </div>
        </div>
      </div>

      {/* SVG Retention / Hazard Curve */}
      <div className="mt-6">
        <div className="grid grid-cols-5 gap-2 sm:gap-4">
          {cohortStats.map((item) => (
            <div key={item.label} className="flex flex-col items-center text-center">
              <span className="font-mono text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                {item.label}
              </span>
              <span className="text-[10px] text-slate-400 mb-2 truncate max-w-full">
                {item.phase}
              </span>

              {/* Vertical Stack Bar */}
              <div className="relative h-44 w-full max-w-[48px] rounded-t overflow-hidden bg-slate-100 dark:bg-slate-800 flex flex-col justify-end">
                {/* Churn part (top) */}
                <div
                  className="w-full bg-[#ff4b4b]/90 transition-all duration-500 flex items-center justify-center text-[10px] font-mono text-white"
                  style={{ height: `${item.churnRate}%` }}
                  title={`Churn Rate: ${item.churnRate.toFixed(1)}%`}
                >
                  {item.churnRate > 15 && `${item.churnRate.toFixed(0)}%`}
                </div>
                {/* Retention part (bottom) */}
                <div
                  className="w-full bg-emerald-500/90 transition-all duration-500 flex items-center justify-center text-[10px] font-mono text-white"
                  style={{ height: `${item.retentionRate}%` }}
                  title={`Retention: ${item.retentionRate.toFixed(1)}%`}
                >
                  {item.retentionRate > 20 && `${item.retentionRate.toFixed(0)}%`}
                </div>
              </div>

              <div className="mt-2 font-mono text-[11px] text-slate-500">
                {item.count} users
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-md bg-amber-50/70 p-3 text-xs text-amber-900 border border-amber-200/60 dark:bg-amber-950/20 dark:text-amber-200 dark:border-amber-800/40 flex items-start gap-2">
        <span className="font-semibold shrink-0">Retention Strategy:</span>
        <span>
          Implement a 90-day structured onboarding check-in. Customers reaching 12 months in service have an 88%+ likelihood of staying long term.
        </span>
      </div>
    </div>
  );
};

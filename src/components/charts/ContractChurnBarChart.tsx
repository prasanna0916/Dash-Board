import React from 'react';
import { CustomerRecord } from '../../types';

interface ContractChurnBarChartProps {
  data: CustomerRecord[];
}

export const ContractChurnBarChart: React.FC<ContractChurnBarChartProps> = ({ data }) => {
  const contracts: ('Month-to-month' | 'One year' | 'Two year')[] = [
    'Month-to-month',
    'One year',
    'Two year',
  ];

  const stats = contracts.map((contract) => {
    const cohort = data.filter((d) => d.contract === contract);
    const total = cohort.length;
    const churned = cohort.filter((d) => d.churn === 'Yes').length;
    const rate = total > 0 ? (churned / total) * 100 : 0;
    const revenue = cohort.reduce((acc, c) => acc + c.monthlyCharges, 0);

    return {
      contract,
      total,
      churned,
      rate,
      revenue,
      retained: total - churned,
    };
  });

  const maxRate = 50; // benchmark 50% scale

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[#ff4b4b] font-semibold">st.plotly_chart(fig)</span>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              Churn Rate & Customer Volume by Contract Agreement
            </h4>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Key Insight: Month-to-month contracts have <span className="font-semibold text-rose-600 dark:text-rose-400">4x higher churn</span> than 1-year commitments.
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-[#ff4b4b]" />
            <span className="text-slate-600 dark:text-slate-400">Churn Rate (%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-slate-300 dark:bg-slate-700" />
            <span className="text-slate-600 dark:text-slate-400">Total Customers</span>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {stats.map((item) => {
          const rateWidth = Math.min(100, (item.rate / maxRate) * 100);
          return (
            <div key={item.contract} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {item.contract}
                </span>
                <div className="flex items-center gap-3 font-mono text-xs tabular-nums">
                  <span className="text-slate-500">
                    {item.churned} churned / {item.total} total
                  </span>
                  <span className={`font-bold ${item.rate > 30 ? 'text-[#ff4b4b]' : item.rate > 10 ? 'text-amber-500' : 'text-emerald-500'}`}>
                    {item.rate.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Progress bar visualizer */}
              <div className="relative h-6 w-full overflow-hidden rounded bg-slate-100 dark:bg-slate-800/80">
                <div
                  className={`h-full transition-all duration-500 flex items-center px-2 text-[11px] font-mono font-medium text-white ${
                    item.rate > 30 ? 'bg-[#ff4b4b]' : item.rate > 10 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.max(6, rateWidth)}%` }}
                >
                  {item.rate > 8 && `${item.rate.toFixed(1)}%`}
                </div>
              </div>

              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>Monthly Cohort MRR: ${item.revenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                <span>Active Retained: {item.retained}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

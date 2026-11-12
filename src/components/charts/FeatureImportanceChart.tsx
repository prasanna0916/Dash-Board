import React from 'react';
import { FEATURE_IMPORTANCE } from '../../data/telcoDataset';

export const FeatureImportanceChart: React.FC = () => {
  const maxImportance = 0.30;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[#ff4b4b] font-semibold">rf.feature_importances_</span>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              Random Forest Feature Importance Weights (Gini Impurity)
            </h4>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Contract type, tenure duration, and monthly charge tier account for <span className="font-semibold text-slate-800 dark:text-slate-200">69.2%</span> of total model decision entropy.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-[#ff4b4b]" />
            <span className="text-slate-600 dark:text-slate-400">Risk Enhancer</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-emerald-500" />
            <span className="text-slate-600 dark:text-slate-400">Retention Shield</span>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3.5">
        {FEATURE_IMPORTANCE.map((item) => {
          const widthPct = (item.importance / maxImportance) * 100;
          const isShield = item.direction.includes('Decreases');

          return (
            <div key={item.feature} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {item.feature}
                </span>
                <div className="flex items-center gap-3 font-mono text-xs tabular-nums">
                  <span className="text-[11px] text-slate-400">{item.direction}</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {(item.importance * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Horizontal bar */}
              <div className="h-3.5 w-full overflow-hidden rounded bg-slate-100 dark:bg-slate-800">
                <div
                  className={`h-full transition-all duration-500 ${
                    isShield ? 'bg-emerald-500' : 'bg-[#ff4b4b]'
                  }`}
                  style={{ width: `${widthPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { CustomerRecord } from '../../types';
import { Sliders } from 'lucide-react';

interface ConfusionMatrixChartProps {
  data: CustomerRecord[];
}

export const ConfusionMatrixChart: React.FC<ConfusionMatrixChartProps> = ({ data }) => {
  // Classification threshold slider
  const [threshold, setThreshold] = useState(0.48);

  // Compute live confusion matrix based on customerRiskScore vs threshold
  let tp = 0; // Actual Churn = Yes, Predicted >= threshold
  let fp = 0; // Actual Churn = No, Predicted >= threshold
  let tn = 0; // Actual Churn = No, Predicted < threshold
  let fn = 0; // Actual Churn = Yes, Predicted < threshold

  data.forEach((d) => {
    const isActualChurn = d.churn === 'Yes';
    const isPredictedChurn = d.churnRiskScore >= threshold;

    if (isActualChurn && isPredictedChurn) tp++;
    else if (!isActualChurn && isPredictedChurn) fp++;
    else if (!isActualChurn && !isPredictedChurn) tn++;
    else if (isActualChurn && !isPredictedChurn) fn++;
  });

  const total = tp + fp + tn + fn;
  const accuracy = total > 0 ? ((tp + tn) / total) * 100 : 0;
  const precision = tp + fp > 0 ? (tp / (tp + fp)) * 100 : 0;
  const recall = tp + fn > 0 ? (tp / (tp + fn)) * 100 : 0;
  const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[#ff4b4b] font-semibold">sklearn.metrics.confusion_matrix</span>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              Dynamic Confusion Matrix & Classification Threshold Tuning
            </h4>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Slide the decision threshold to trade off between Recall (catch every churner) and Precision (avoid unnecessary retention discounts).
          </p>
        </div>

        {/* Live Threshold Control */}
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/80 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
          <Sliders className="h-4 w-4 text-[#ff4b4b]" />
          <div className="text-xs">
            <div className="flex justify-between font-mono text-[11px] text-slate-600 dark:text-slate-300">
              <span>Threshold:</span>
              <span className="font-bold text-[#ff4b4b]">{threshold.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.15"
              max="0.85"
              step="0.05"
              value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))}
              className="w-28 accent-[#ff4b4b]"
            />
          </div>
        </div>
      </div>

      {/* 2x2 Matrix Grid */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Matrix Box */}
        <div className="space-y-2">
          <div className="text-center font-mono text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Predicted Class
          </div>

          <div className="grid grid-cols-2 gap-2 text-center">
            {/* True Negative */}
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/30">
              <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                True Negatives (TN)
              </span>
              <div className="font-mono text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-1 tabular-nums">
                {tn}
              </div>
              <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 mt-0.5">
                Correctly identified loyal
              </p>
            </div>

            {/* False Positive */}
            <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-900/50 dark:bg-amber-950/30">
              <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                False Positives (FP)
              </span>
              <div className="font-mono text-2xl font-bold text-amber-700 dark:text-amber-400 mt-1 tabular-nums">
                {fp}
              </div>
              <p className="text-[11px] text-amber-600/80 dark:text-amber-400/80 mt-0.5">
                Type I Error (False Alarm)
              </p>
            </div>

            {/* False Negative */}
            <div className="rounded-lg border border-rose-200 bg-rose-50/70 p-4 dark:border-rose-900/50 dark:bg-rose-950/30">
              <span className="text-[11px] font-semibold text-rose-800 dark:text-rose-300 uppercase tracking-wider">
                False Negatives (FN)
              </span>
              <div className="font-mono text-2xl font-bold text-rose-700 dark:text-rose-400 mt-1 tabular-nums">
                {fn}
              </div>
              <p className="text-[11px] text-rose-600/80 dark:text-rose-400/80 mt-0.5">
                Type II Error (Missed Churners)
              </p>
            </div>

            {/* True Positive */}
            <div className="rounded-lg border border-sky-200 bg-sky-50/70 p-4 dark:border-sky-900/50 dark:bg-sky-950/30">
              <span className="text-[11px] font-semibold text-sky-800 dark:text-sky-300 uppercase tracking-wider">
                True Positives (TP)
              </span>
              <div className="font-mono text-2xl font-bold text-sky-700 dark:text-sky-400 mt-1 tabular-nums">
                {tp}
              </div>
              <p className="text-[11px] text-sky-600/80 dark:text-sky-400/80 mt-0.5">
                Correctly flagged churners
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Model Performance KPIs */}
        <div className="space-y-3 rounded-lg border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40">
          <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Real-Time Metric Indicators (Threshold: {threshold.toFixed(2)})
          </h5>

          <div className="space-y-2.5">
            <div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-600 dark:text-slate-400">Model Accuracy:</span>
                <span className="font-bold text-slate-900 dark:text-white tabular-nums">{accuracy.toFixed(1)}%</span>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div className="h-full bg-slate-800 dark:bg-slate-200 transition-all duration-300" style={{ width: `${accuracy}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-600 dark:text-slate-400">Recall (Sensitivity):</span>
                <span className="font-bold text-sky-600 dark:text-sky-400 tabular-nums">{recall.toFixed(1)}%</span>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div className="h-full bg-sky-500 transition-all duration-300" style={{ width: `${recall}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-600 dark:text-slate-400">Precision:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">{precision.toFixed(1)}%</span>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${precision}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-600 dark:text-slate-400">F1-Harmonic Score:</span>
                <span className="font-bold text-[#ff4b4b] tabular-nums">{f1.toFixed(1)}%</span>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div className="h-full bg-[#ff4b4b] transition-all duration-300" style={{ width: `${f1}%` }} />
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 mt-2">
            💡 For customer churn, lowering the threshold to <strong>0.35</strong> catches 88% of leaving customers with only moderate false alarms.
          </p>
        </div>
      </div>
    </div>
  );
};

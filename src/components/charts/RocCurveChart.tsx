import React from 'react';

export const RocCurveChart: React.FC = () => {
  // Pre-calculated representative points for the Random Forest model
  const rocPoints = [
    { fpr: 0.00, tpr: 0.00 },
    { fpr: 0.03, tpr: 0.28 },
    { fpr: 0.06, tpr: 0.45 },
    { fpr: 0.10, tpr: 0.62 },
    { fpr: 0.16, tpr: 0.74 },
    { fpr: 0.24, tpr: 0.82 },
    { fpr: 0.35, tpr: 0.88 },
    { fpr: 0.50, tpr: 0.93 },
    { fpr: 0.70, tpr: 0.97 },
    { fpr: 1.00, tpr: 1.00 },
  ];

  // Map 0-1 to SVG viewBox coordinates (width=300, height=200 with padding)
  const padding = 30;
  const width = 320;
  const height = 220;
  const plotW = width - padding * 2;
  const plotH = height - padding * 2;

  const pointsPath = rocPoints
    .map((p, i) => {
      const x = padding + p.fpr * plotW;
      const y = height - padding - p.tpr * plotH;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');

  const areaPath = `${pointsPath} L ${padding + plotW} ${height - padding} L ${padding} ${height - padding} Z`;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[#ff4b4b] font-semibold">sklearn.metrics.roc_curve</span>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              ROC Curve & Area Under Curve (ROC-AUC: 0.865)
            </h4>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Model discriminates churners from non-churners with an <span className="font-semibold text-slate-800 dark:text-slate-200">86.5% probability ranking accuracy</span>.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff4b4b]" />
            <span className="text-slate-600 dark:text-slate-400">Random Forest (0.865)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-0.5 w-3 bg-slate-400" />
            <span className="text-slate-400">Random Baseline (0.50)</span>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col md:flex-row items-center justify-center gap-6">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[340px] overflow-visible">
          {/* Grid lines */}
          <line x1={padding} y1={height - padding} x2={padding + plotW} y2={height - padding} stroke="currentColor" className="text-slate-200 dark:text-slate-700" strokeWidth="1" />
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="currentColor" className="text-slate-200 dark:text-slate-700" strokeWidth="1" />
          
          {/* Diagonal random chance line */}
          <line
            x1={padding}
            y1={height - padding}
            x2={padding + plotW}
            y2={padding}
            stroke="currentColor"
            className="text-slate-300 dark:text-slate-600"
            strokeDasharray="4 4"
            strokeWidth="1.5"
          />

          {/* Area fill */}
          <path d={areaPath} fill="rgba(255, 75, 75, 0.12)" />

          {/* ROC Curve Path */}
          <path d={pointsPath} fill="none" stroke="#ff4b4b" strokeWidth="2.5" />

          {/* Markers */}
          {rocPoints.map((p, idx) => {
            const cx = padding + p.fpr * plotW;
            const cy = height - padding - p.tpr * plotH;
            return (
              <circle
                key={idx}
                cx={cx}
                cy={cy}
                r="3"
                className="fill-[#ff4b4b] stroke-white dark:stroke-slate-900 stroke-2 hover:r-4 transition-all"
              >
                <title>{`FPR: ${(p.fpr * 100).toFixed(0)}%, TPR: ${(p.tpr * 100).toFixed(0)}%`}</title>
              </circle>
            );
          })}

          {/* Axis Labels */}
          <text x={padding + plotW / 2} y={height - 8} textAnchor="middle" className="text-[10px] font-mono fill-slate-500">
            False Positive Rate (1 - Specificity)
          </text>
          <text
            x={-height / 2}
            y={12}
            transform="rotate(-90)"
            textAnchor="middle"
            className="text-[10px] font-mono fill-slate-500"
          >
            True Positive Rate (Recall)
          </text>
        </svg>

        <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 max-w-xs">
          <div className="rounded border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/60">
            <div className="font-semibold text-slate-900 dark:text-white">Optimal Operating Threshold:</div>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              At <strong>FPR = 0.16</strong>, the model successfully captures <strong>74%</strong> of churn events with minimal false outreach.
            </p>
          </div>
          <div className="font-mono text-[11px] text-slate-500 space-y-1">
            <div>• Baseline Random Guess: AUC = 0.500</div>
            <div>• Logistic Regression: AUC = 0.842</div>
            <div className="text-[#ff4b4b] font-bold">• Random Forest Ensemble: AUC = 0.865</div>
          </div>
        </div>
      </div>
    </div>
  );
};

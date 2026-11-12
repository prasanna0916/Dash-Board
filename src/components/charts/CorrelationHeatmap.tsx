import React, { useState } from 'react';
import { CORRELATION_MATRIX } from '../../data/telcoDataset';

export const CorrelationHeatmap: React.FC = () => {
  const { columns, data } = CORRELATION_MATRIX;
  const [hoveredCell, setHoveredCell] = useState<{
    row: string;
    col: string;
    val: number;
  } | null>(null);

  // Helper function to color code correlation value: -1 (blue/cool) to +1 (red/warm)
  const getCellColor = (val: number) => {
    if (val === 1) return 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold';
    if (val > 0.4) return 'bg-[#ff4b4b] text-white font-semibold';
    if (val > 0.2) return 'bg-[#ff4b4b]/60 text-white font-medium';
    if (val > 0.05) return 'bg-[#ff4b4b]/20 text-slate-900 dark:text-white';
    if (val >= -0.05) return 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400';
    if (val >= -0.2) return 'bg-sky-500/20 text-slate-900 dark:text-white';
    if (val >= -0.4) return 'bg-sky-500/60 text-white font-medium';
    return 'bg-sky-600 text-white font-semibold';
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[#ff4b4b] font-semibold">sns.heatmap(df.corr())</span>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              Pearson Correlation Matrix (Feature Interactions)
            </h4>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Tenure (-0.35) and 2-Year Contracts (-0.31) strongly protect against churn; Monthly Charges (+0.20) increases churn.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1">
            <span className="h-3 w-4 rounded bg-sky-600" />
            <span className="text-slate-500">-0.35 Negative</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-3 w-4 rounded bg-slate-200 dark:bg-slate-700" />
            <span className="text-slate-500">0.0 Neutral</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-3 w-4 rounded bg-[#ff4b4b]" />
            <span className="text-slate-500">+0.50 Positive</span>
          </div>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-center text-xs font-mono">
          <thead>
            <tr>
              <th className="p-2 text-left text-slate-400 font-sans text-[11px]">Feature</th>
              {columns.map((col) => (
                <th key={col} className="p-2 text-slate-700 dark:text-slate-300 font-semibold text-[11px] truncate max-w-[80px]">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {columns.map((rowCol, rIdx) => (
              <tr key={rowCol}>
                <td className="p-2 text-left font-sans font-medium text-slate-700 dark:text-slate-300 text-xs">
                  {rowCol}
                </td>
                {columns.map((col, cIdx) => {
                  const val = data[rIdx][cIdx];
                  return (
                    <td
                      key={col}
                      onMouseEnter={() => setHoveredCell({ row: rowCol, col, val })}
                      onMouseLeave={() => setHoveredCell(null)}
                      className={`p-2 transition-all cursor-pointer rounded-sm ${getCellColor(val)}`}
                    >
                      {val > 0 && val !== 1 ? `+${val.toFixed(2)}` : val.toFixed(2)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hoveredCell ? (
        <div className="mt-3 text-xs font-mono text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded">
          Correlation between <span className="font-semibold text-slate-900 dark:text-white">{hoveredCell.row}</span> and{' '}
          <span className="font-semibold text-slate-900 dark:text-white">{hoveredCell.col}</span>:{' '}
          <span className="font-bold text-[#ff4b4b]">{hoveredCell.val > 0 ? `+${hoveredCell.val.toFixed(2)}` : hoveredCell.val.toFixed(2)}</span>
        </div>
      ) : (
        <p className="mt-3 text-[11px] text-slate-400">
          Hover over any correlation cell to inspect pairwise feature covariance.
        </p>
      )}
    </div>
  );
};

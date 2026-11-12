import React from 'react';
import { CustomerRecord } from '../../types';
import { MODEL_BENCHMARKS } from '../../data/telcoDataset';
import { ConfusionMatrixChart } from '../charts/ConfusionMatrixChart';
import { RocCurveChart } from '../charts/RocCurveChart';
import { FeatureImportanceChart } from '../charts/FeatureImportanceChart';
import { Cpu, Award, CheckCircle } from 'lucide-react';

interface ModelEvaluationPageProps {
  data: CustomerRecord[];
}

export const ModelEvaluationPage: React.FC<ModelEvaluationPageProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <span>Machine Learning Model Evaluation & Diagnostics</span>
          <span className="font-mono text-xs font-normal text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
            scikit-learn
          </span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Comparing supervised classification models on an 80/20 stratified train-test split with 5-fold cross-validation.
        </p>
      </div>

      {/* Model Benchmark Comparison Table */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-[#ff4b4b]" />
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              Model Performance Benchmark (Stratified 5-Fold Cross Validation)
            </h4>
          </div>
          <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <Award className="h-3.5 w-3.5" />
            <span>Champion Model: Random Forest</span>
          </span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300">
              <tr>
                <th className="py-2.5 px-3 font-sans">Model Architecture</th>
                <th className="py-2.5 px-3 text-right">Accuracy</th>
                <th className="py-2.5 px-3 text-right">ROC-AUC</th>
                <th className="py-2.5 px-3 text-right">Precision</th>
                <th className="py-2.5 px-3 text-right">Recall</th>
                <th className="py-2.5 px-3 text-right">F1-Score</th>
                <th className="py-2.5 px-3 font-sans">Deployment Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {MODEL_BENCHMARKS.map((m) => {
                const isChampion = m.name.includes('Random Forest');
                return (
                  <tr
                    key={m.name}
                    className={`transition-colors ${
                      isChampion
                        ? 'bg-red-50/40 dark:bg-red-950/20 font-semibold'
                        : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-3 px-3 font-sans text-slate-900 dark:text-white flex items-center gap-2">
                      {isChampion && <CheckCircle className="h-3.5 w-3.5 text-[#ff4b4b] shrink-0" />}
                      <span>{m.name}</span>
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums text-slate-700 dark:text-slate-300">
                      {m.accuracy.toFixed(1)}%
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums text-[#ff4b4b] font-bold">
                      {m.rocAuc.toFixed(3)}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums text-slate-700 dark:text-slate-300">
                      {m.precision.toFixed(1)}%
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums text-slate-700 dark:text-slate-300">
                      {m.recall.toFixed(1)}%
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums text-slate-700 dark:text-slate-300">
                      {m.f1Score.toFixed(1)}%
                    </td>
                    <td className="py-3 px-3 font-sans text-xs text-slate-500">
                      {m.bestFor}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Confusion Matrix */}
      <ConfusionMatrixChart data={data} />

      {/* ROC Curve & Feature Importance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RocCurveChart />
        <FeatureImportanceChart />
      </div>
    </div>
  );
};

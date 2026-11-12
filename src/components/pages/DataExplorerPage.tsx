import React from 'react';
import { CustomerRecord, DatasetId } from '../../types';
import { StreamlitDataFrame } from '../streamlit/StreamlitDataFrame';
import { CorrelationHeatmap } from '../charts/CorrelationHeatmap';
import { SUPERSTORE_DATA, PENGUINS_DATA } from '../../data/otherDatasets';

interface DataExplorerPageProps {
  currentDataset: DatasetId;
  telcoData: CustomerRecord[];
}

export const DataExplorerPage: React.FC<DataExplorerPageProps> = ({
  currentDataset,
  telcoData,
}) => {
  if (currentDataset === 'superstore') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Superstore Retail Sales & Profit Data</span>
            <span className="font-mono text-xs font-normal text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
              st.dataframe()
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Examining transaction margins, discount depths, and product category returns across retail sales channels.
          </p>
        </div>

        <StreamlitDataFrame
          data={SUPERSTORE_DATA}
          title="st.dataframe(superstore_df)"
          caption="Retail transactions with profit margins and regional distributions"
          fileName="superstore_sales.csv"
          columns={[
            { key: 'orderId', header: 'Order ID' },
            { key: 'orderDate', header: 'Order Date' },
            { key: 'category', header: 'Category' },
            { key: 'subCategory', header: 'Sub-Category' },
            { key: 'region', header: 'Region' },
            {
              key: 'sales',
              header: 'Sales ($)',
              isNumeric: true,
              render: (r) => `$${r.sales.toFixed(2)}`,
            },
            { key: 'discount', header: 'Discount', isNumeric: true, render: (r) => `${(r.discount * 100).toFixed(0)}%` },
            {
              key: 'profit',
              header: 'Profit ($)',
              isNumeric: true,
              render: (r) => (
                <span className={r.profit < 0 ? 'text-[#ff4b4b] font-bold' : 'text-emerald-600 font-bold'}>
                  ${r.profit.toFixed(2)}
                </span>
              ),
            },
            {
              key: 'profitMargin',
              header: 'Margin (%)',
              isNumeric: true,
              render: (r) => `${r.profitMargin.toFixed(1)}%`,
            },
          ]}
        />
      </div>
    );
  }

  if (currentDataset === 'penguins') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Palmer Penguins Biological Dataset</span>
            <span className="font-mono text-xs font-normal text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
              st.dataframe()
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Classic multiclass dataset analyzing morphological measurements across Adelie, Gentoo, and Chinstrap penguins.
          </p>
        </div>

        <StreamlitDataFrame
          data={PENGUINS_DATA}
          title="st.dataframe(penguins_df)"
          caption="Palmer Archipelago penguin morphometrics"
          fileName="palmer_penguins.csv"
          columns={[
            { key: 'species', header: 'Species' },
            { key: 'island', header: 'Island' },
            { key: 'billLengthMm', header: 'Bill Length (mm)', isNumeric: true },
            { key: 'billDepthMm', header: 'Bill Depth (mm)', isNumeric: true },
            { key: 'flipperLengthMm', header: 'Flipper Length (mm)', isNumeric: true },
            { key: 'bodyMassG', header: 'Body Mass (g)', isNumeric: true },
            { key: 'sex', header: 'Sex' },
          ]}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <span>Raw Customer Dataset & Feature Statistics</span>
          <span className="font-mono text-xs font-normal text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
            st.dataframe()
          </span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Interactive tabular inspection of the filtered cohort with sorting, live text search, and full CSV export.
        </p>
      </div>

      {/* Main DataFrame Component */}
      <StreamlitDataFrame
        data={telcoData}
        title="st.dataframe(telco_df)"
        caption="Full customer records with tenure, contract terms, monthly fees, and calculated churn risk scores"
        fileName="telco_customer_churn_export.csv"
        columns={[
          { key: 'id', header: 'Customer ID' },
          { key: 'tenure', header: 'Tenure (mos)', isNumeric: true },
          { key: 'contract', header: 'Contract' },
          { key: 'internetService', header: 'Internet' },
          { key: 'techSupport', header: 'Tech Support' },
          { key: 'paymentMethod', header: 'Payment Method' },
          {
            key: 'monthlyCharges',
            header: 'Monthly ($)',
            isNumeric: true,
            render: (r) => `$${r.monthlyCharges.toFixed(2)}`,
          },
          {
            key: 'totalCharges',
            header: 'Total ($)',
            isNumeric: true,
            render: (r) => `$${r.totalCharges.toFixed(2)}`,
          },
          {
            key: 'churnRiskScore',
            header: 'Risk Score',
            isNumeric: true,
            render: (r) => (
              <span
                className={`font-mono font-bold ${
                  r.churnRiskScore >= 0.5 ? 'text-[#ff4b4b]' : 'text-emerald-600'
                }`}
              >
                {(r.churnRiskScore * 100).toFixed(0)}%
              </span>
            ),
          },
          {
            key: 'churn',
            header: 'Churned',
            render: (r) => (
              <span
                className={`rounded px-1.5 py-0.5 text-[11px] font-semibold ${
                  r.churn === 'Yes'
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                }`}
              >
                {r.churn}
              </span>
            ),
          },
        ]}
      />

      {/* Correlation Matrix Heatmap */}
      <CorrelationHeatmap />
    </div>
  );
};

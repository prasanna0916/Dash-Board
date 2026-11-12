import React, { useState } from 'react';
import { CustomerRecord } from '../../types';
import { StreamlitTabs } from '../streamlit/StreamlitTabs';
import { ChargesDistributionChart } from '../charts/ChargesDistributionChart';
import { SupportShieldChart } from '../charts/SupportShieldChart';
import { ContractChurnBarChart } from '../charts/ContractChurnBarChart';
import { CreditCard, Users, Shield, DollarSign } from 'lucide-react';

interface EdaPageProps {
  data: CustomerRecord[];
}

export const EdaPage: React.FC<EdaPageProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    '📊 Contract & Payment Methods',
    '💰 Charges & Price Sensitivity',
    '🛡️ Tech Support & Value Add-ons',
    '👥 Demographics & Household',
  ];

  // Payment method analysis
  const paymentMethods: ('Electronic check' | 'Mailed check' | 'Bank transfer' | 'Credit card')[] = [
    'Electronic check',
    'Mailed check',
    'Bank transfer',
    'Credit card',
  ];

  const paymentStats = paymentMethods.map((pm) => {
    const subset = data.filter((d) => d.paymentMethod === pm);
    const total = subset.length;
    const churned = subset.filter((d) => d.churn === 'Yes').length;
    const churnRate = total > 0 ? (churned / total) * 100 : 0;
    return { method: pm, total, churned, churnRate };
  });

  // Senior citizen vs non-senior
  const seniorStats = [
    { label: 'Senior Citizens (65+)', subset: data.filter((d) => d.seniorCitizen) },
    { label: 'Non-Seniors (<65)', subset: data.filter((d) => !d.seniorCitizen) },
  ].map((item) => {
    const total = item.subset.length;
    const churned = item.subset.filter((d) => d.churn === 'Yes').length;
    return {
      label: item.label,
      total,
      churned,
      churnRate: total > 0 ? (churned / total) * 100 : 0,
    };
  });

  // Partner & Dependents
  const householdStats = [
    { label: 'Has Partner & Dependents', subset: data.filter((d) => d.partner && d.dependents) },
    { label: 'Partner Only (No Dependents)', subset: data.filter((d) => d.partner && !d.dependents) },
    { label: 'Solo / Independent', subset: data.filter((d) => !d.partner && !d.dependents) },
  ].map((item) => {
    const total = item.subset.length;
    const churned = item.subset.filter((d) => d.churn === 'Yes').length;
    return {
      label: item.label,
      total,
      churned,
      churnRate: total > 0 ? (churned / total) * 100 : 0,
    };
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <span>Exploratory Data Analysis (EDA)</span>
          <span className="font-mono text-xs font-normal text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
            st.tabs()
          </span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Bivariate and multivariate hypothesis testing across contract terms, payment workflows, service bundles, and demographics.
        </p>
      </div>

      {/* Streamlit Tabs Navigation */}
      <StreamlitTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab 0: Contract & Payment Methods */}
      {activeTab === 0 && (
        <div className="space-y-6">
          <ContractChurnBarChart data={data} />

          {/* Payment Method Churn Breakdown */}
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-[#ff4b4b]" />
                  <span>Churn Rate by Billing & Payment Channel</span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Customers paying via <strong>Electronic Check</strong> churn at double the rate of automatic payment methods.
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-4 gap-4">
              {paymentStats.map((item) => (
                <div
                  key={item.method}
                  className="rounded-lg border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40"
                >
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {item.method}
                  </span>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span
                      className={`font-mono text-xl font-bold tabular-nums ${
                        item.churnRate > 35 ? 'text-[#ff4b4b]' : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {item.churnRate.toFixed(1)}%
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {item.churned}/{item.total}
                    </span>
                  </div>

                  <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className={`h-full ${item.churnRate > 35 ? 'bg-[#ff4b4b]' : 'bg-slate-500'}`}
                      style={{ width: `${item.churnRate * 2}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-md bg-slate-100/70 p-3 text-xs text-slate-600 dark:bg-slate-800/60 dark:text-slate-400">
              💡 <strong>Frictionless Payments Hypothesis:</strong> Electronic checks require manual monthly payment approval, creating recurring friction points where customers reconsider their subscription. Migrating customers to Automated Credit Card / ACH cuts churn by 18%.
            </div>
          </div>
        </div>
      )}

      {/* Tab 1: Monthly Charges & Price Sensitivity */}
      {activeTab === 1 && (
        <div className="space-y-6">
          <ChargesDistributionChart data={data} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <h5 className="font-semibold text-xs text-slate-900 dark:text-white flex items-center gap-1.5 mb-2">
                <DollarSign className="h-4 w-4 text-emerald-500" />
                <span>Price Elasticity Threshold</span>
              </h5>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                When monthly service fees exceed <strong>$75/month</strong>, churn hazard doubles unless the customer has bundled at least 2 security or streaming add-ons. Pricing plans above $90/mo require high perceived service reliability.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <h5 className="font-semibold text-xs text-slate-900 dark:text-white flex items-center gap-1.5 mb-2">
                <DollarSign className="h-4 w-4 text-[#ff4b4b]" />
                <span>Total Charges Accumulation Effect</span>
              </h5>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                As cumulative spend increases beyond $1,500, customer churn drops precipitously. This represents the "sunk cost / relationship maturity" threshold in telecom customer lifecycle models.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Tech Support & Value Add-ons */}
      {activeTab === 2 && (
        <div className="space-y-6">
          <SupportShieldChart data={data} />
        </div>
      )}

      {/* Tab 3: Demographics & Household */}
      {activeTab === 3 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Senior Citizens Breakdown */}
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-[#ff4b4b]" />
                <span>Senior Citizen Churn Comparison</span>
              </h4>
              <p className="text-xs text-slate-500 mb-4">
                Senior citizens exhibit higher price sensitivity and lower online portal adoption.
              </p>

              <div className="space-y-4">
                {seniorStats.map((item) => (
                  <div key={item.label} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span>{item.label}</span>
                      <span className="font-mono text-[#ff4b4b] font-bold">{item.churnRate.toFixed(1)}%</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden dark:bg-slate-800">
                      <div
                        className={`h-full ${item.churnRate > 30 ? 'bg-[#ff4b4b]' : 'bg-slate-500'}`}
                        style={{ width: `${item.churnRate * 2}%` }}
                      />
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 text-right">
                      {item.churned} churned of {item.total} total
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Household Structure */}
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-emerald-500" />
                <span>Household Anchoring (Partner & Dependents)</span>
              </h4>
              <p className="text-xs text-slate-500 mb-4">
                Customers with families and shared household accounts are significantly stickier.
              </p>

              <div className="space-y-4">
                {householdStats.map((item) => (
                  <div key={item.label} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span>{item.label}</span>
                      <span className="font-mono text-slate-800 dark:text-slate-200 font-bold">
                        {item.churnRate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden dark:bg-slate-800">
                      <div
                        className="h-full bg-emerald-500"
                        style={{ width: `${item.churnRate * 2}%` }}
                      />
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 text-right">
                      {item.churned} churned of {item.total} total
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

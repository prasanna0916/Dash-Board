import { CustomerRecord, MetricSummary } from '../types';

// Deterministic Pseudo-Random Number Generator for reproducible data
function pseudoRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function generateTelcoDataset(count: number = 700): CustomerRecord[] {
  const records: CustomerRecord[] = [];
  const contracts: ('Month-to-month' | 'One year' | 'Two year')[] = ['Month-to-month', 'One year', 'Two year'];
  const internetTypes: ('DSL' | 'Fiber optic' | 'No')[] = ['DSL', 'Fiber optic', 'No'];
  const paymentMethods: ('Electronic check' | 'Mailed check' | 'Bank transfer' | 'Credit card')[] = [
    'Electronic check', 'Bank transfer', 'Credit card', 'Mailed check'
  ];

  for (let i = 1; i <= count; i++) {
    const r1 = pseudoRandom(i * 1.13);
    const r2 = pseudoRandom(i * 2.37);
    const r3 = pseudoRandom(i * 3.71);
    const r4 = pseudoRandom(i * 4.93);
    const r5 = pseudoRandom(i * 5.17);
    const r6 = pseudoRandom(i * 6.43);
    const r7 = pseudoRandom(i * 7.89);
    const r8 = pseudoRandom(i * 8.21);

    const gender = r1 > 0.5 ? 'Male' : 'Female';
    const seniorCitizen = r2 < 0.16; // 16% senior citizens
    const partner = r3 > 0.52;
    const dependents = partner && r4 > 0.6;
    
    // Contract distribution: 55% month-to-month, 21% 1-year, 24% 2-year
    let contract: 'Month-to-month' | 'One year' | 'Two year';
    if (r5 < 0.55) {
      contract = 'Month-to-month';
    } else if (r5 < 0.76) {
      contract = 'One year';
    } else {
      contract = 'Two year';
    }

    // Tenure correlated with contract
    let tenure = 1;
    if (contract === 'Month-to-month') {
      tenure = Math.floor(1 + r6 * 30); // 1 to 30 months
    } else if (contract === 'One year') {
      tenure = Math.floor(12 + r6 * 40); // 12 to 52 months
    } else {
      tenure = Math.floor(24 + r6 * 48); // 24 to 72 months
    }
    tenure = Math.min(72, Math.max(1, tenure));

    const internetService = r7 < 0.44 ? 'Fiber optic' : (r7 < 0.78 ? 'DSL' : 'No');
    const techSupport = internetService === 'No' ? 'No internet' : (r8 > 0.65 ? 'Yes' : 'No');
    const onlineSecurity = internetService === 'No' ? 'No internet' : (pseudoRandom(i * 9.11) > 0.68 ? 'Yes' : 'No');
    const onlineBackup = internetService === 'No' ? 'No internet' : (pseudoRandom(i * 10.3) > 0.60 ? 'Yes' : 'No');
    const deviceProtection = internetService === 'No' ? 'No internet' : (pseudoRandom(i * 11.5) > 0.62 ? 'Yes' : 'No');
    const streamingTV = internetService === 'No' ? 'No internet' : (pseudoRandom(i * 12.7) > 0.55 ? 'Yes' : 'No');
    const phoneService = pseudoRandom(i * 13.9) > 0.10;
    const multipleLines = !phoneService ? 'No phone service' : (pseudoRandom(i * 14.1) > 0.58 ? 'Yes' : 'No');
    const paperlessBilling = pseudoRandom(i * 15.3) > 0.41;
    const paymentMethod = paymentMethods[Math.floor(pseudoRandom(i * 16.7) * paymentMethods.length)];

    // Realistic monthly charges based on internet tier & add-ons
    let baseCharge = 20.0;
    if (internetService === 'Fiber optic') baseCharge = 70.0;
    else if (internetService === 'DSL') baseCharge = 45.0;

    let extras = 0;
    if (techSupport === 'Yes') extras += 10;
    if (onlineSecurity === 'Yes') extras += 10;
    if (onlineBackup === 'Yes') extras += 10;
    if (deviceProtection === 'Yes') extras += 10;
    if (streamingTV === 'Yes') extras += 15;
    if (multipleLines === 'Yes') extras += 10;

    const monthlyCharges = Number((baseCharge + extras + (pseudoRandom(i * 17.5) * 8 - 4)).toFixed(2));
    const totalCharges = Number((monthlyCharges * tenure * (0.95 + pseudoRandom(i * 18.1) * 0.1)).toFixed(2));

    // Calculate Ground-Truth Churn Probability using logistic weights
    let logit = -1.5; // baseline negative log-odds
    if (contract === 'Month-to-month') logit += 1.45;
    else if (contract === 'Two year') logit -= 1.6;

    if (internetService === 'Fiber optic') logit += 0.85;
    if (techSupport === 'No' && internetService !== 'No') logit += 0.65;
    if (onlineSecurity === 'No' && internetService !== 'No') logit += 0.45;
    if (tenure < 6) logit += 1.1;
    else if (tenure > 36) logit -= 1.2;
    if (paymentMethod === 'Electronic check') logit += 0.55;
    if (paperlessBilling) logit += 0.3;
    if (seniorCitizen) logit += 0.25;

    // Add small random noise
    logit += (pseudoRandom(i * 19.3) - 0.5) * 0.8;

    const prob = 1 / (1 + Math.exp(-logit));
    const churn = prob > 0.48 ? 'Yes' : 'No';

    records.push({
      id: `CUST-${(1000 + i).toString()}`,
      gender,
      seniorCitizen,
      partner,
      dependents,
      tenure,
      phoneService,
      multipleLines,
      internetService,
      onlineSecurity,
      onlineBackup,
      deviceProtection,
      techSupport,
      streamingTV,
      contract,
      paperlessBilling,
      paymentMethod,
      monthlyCharges,
      totalCharges,
      churn,
      churnRiskScore: Number(prob.toFixed(3)),
    });
  }

  return records;
}

export const INITIAL_TELCO_DATA = generateTelcoDataset(700);

export function calculateSummaryMetrics(data: CustomerRecord[]): MetricSummary {
  if (data.length === 0) {
    return {
      totalCustomers: 0,
      churnCount: 0,
      churnRate: 0,
      avgMonthlyCharges: 0,
      avgTenure: 0,
      mrrTotal: 0,
      atRiskRevenue: 0,
      clvAvg: 0,
    };
  }

  const total = data.length;
  const churnCount = data.filter((d) => d.churn === 'Yes').length;
  const churnRate = (churnCount / total) * 100;

  const totalMonthly = data.reduce((acc, curr) => acc + curr.monthlyCharges, 0);
  const avgMonthlyCharges = totalMonthly / total;

  const totalTenure = data.reduce((acc, curr) => acc + curr.tenure, 0);
  const avgTenure = totalTenure / total;

  const atRiskData = data.filter((d) => d.churnRiskScore >= 0.5);
  const atRiskRevenue = atRiskData.reduce((acc, curr) => acc + curr.monthlyCharges, 0);

  // CLV estimation = (Monthly Charges * Tenure)
  const totalClv = data.reduce((acc, curr) => acc + (curr.monthlyCharges * Math.max(12, curr.tenure)), 0);
  const clvAvg = totalClv / total;

  return {
    totalCustomers: total,
    churnCount,
    churnRate: Number(churnRate.toFixed(1)),
    avgMonthlyCharges: Number(avgMonthlyCharges.toFixed(2)),
    avgTenure: Number(avgTenure.toFixed(1)),
    mrrTotal: Number(totalMonthly.toFixed(0)),
    atRiskRevenue: Number(atRiskRevenue.toFixed(0)),
    clvAvg: Number(clvAvg.toFixed(0)),
  };
}

export const FEATURE_IMPORTANCE = [
  { feature: 'Contract: Month-to-Month', importance: 0.285, direction: 'Increases Churn' },
  { feature: 'Tenure (Months in Service)', importance: 0.242, direction: 'Decreases Churn' },
  { feature: 'Monthly Charges ($/mo)', importance: 0.165, direction: 'Increases Churn' },
  { feature: 'Tech Support: No', importance: 0.118, direction: 'Increases Churn' },
  { feature: 'Internet: Fiber Optic', importance: 0.082, direction: 'Increases Churn' },
  { feature: 'Payment: Electronic Check', importance: 0.054, direction: 'Increases Churn' },
  { feature: 'Online Security: Yes', importance: 0.032, direction: 'Decreases Churn' },
  { feature: 'Paperless Billing: Yes', importance: 0.022, direction: 'Increases Churn' },
];

export const CORRELATION_MATRIX = {
  columns: ['Tenure', 'MonthlyCharges', 'TotalCharges', 'IsSenior', 'Contract2Yr', 'HasTechSupp', 'Churn'],
  data: [
    [ 1.00,  0.25,  0.83,  0.02,  0.56,  0.33, -0.35 ], // Tenure
    [ 0.25,  1.00,  0.65,  0.22, -0.06, -0.01,  0.20 ], // MonthlyCharges
    [ 0.83,  0.65,  1.00,  0.10,  0.46,  0.26, -0.20 ], // TotalCharges
    [ 0.02,  0.22,  0.10,  1.00, -0.12, -0.06,  0.15 ], // IsSenior
    [ 0.56, -0.06,  0.46, -0.12,  1.00,  0.24, -0.31 ], // Contract2Yr
    [ 0.33, -0.01,  0.26, -0.06,  0.24,  1.00, -0.28 ], // HasTechSupp
    [-0.35,  0.20, -0.20,  0.15, -0.31, -0.28,  1.00 ], // Churn
  ],
};

export const MODEL_BENCHMARKS = [
  {
    name: 'Random Forest Classifier',
    accuracy: 82.4,
    rocAuc: 0.865,
    precision: 79.2,
    recall: 74.8,
    f1Score: 76.9,
    bestFor: 'Overall balance & non-linear patterns (Recommended)',
  },
  {
    name: 'Gradient Boosting (XGBoost)',
    accuracy: 83.1,
    rocAuc: 0.871,
    precision: 80.5,
    recall: 75.3,
    f1Score: 77.8,
    bestFor: 'Highest AUC score on raw tabular features',
  },
  {
    name: 'Logistic Regression',
    accuracy: 80.6,
    rocAuc: 0.842,
    precision: 76.1,
    recall: 71.4,
    f1Score: 73.7,
    bestFor: 'Fastest inference & transparent odds ratios',
  },
];

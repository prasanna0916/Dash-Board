export interface CustomerRecord {
  id: string;
  gender: 'Male' | 'Female';
  seniorCitizen: boolean;
  partner: boolean;
  dependents: boolean;
  tenure: number; // in months (1 to 72)
  phoneService: boolean;
  multipleLines: 'No' | 'Yes' | 'No phone service';
  internetService: 'DSL' | 'Fiber optic' | 'No';
  onlineSecurity: 'No' | 'Yes' | 'No internet';
  onlineBackup: 'No' | 'Yes' | 'No internet';
  deviceProtection: 'No' | 'Yes' | 'No internet';
  techSupport: 'No' | 'Yes' | 'No internet';
  streamingTV: 'No' | 'Yes' | 'No internet';
  contract: 'Month-to-month' | 'One year' | 'Two year';
  paperlessBilling: boolean;
  paymentMethod: 'Electronic check' | 'Mailed check' | 'Bank transfer' | 'Credit card';
  monthlyCharges: number;
  totalCharges: number;
  churn: 'Yes' | 'No';
  churnRiskScore: number; // 0 to 1
}

export type PageView = 'overview' | 'eda' | 'model' | 'predict' | 'raw_data';

export type DatasetId = 'churn' | 'superstore' | 'penguins';

export interface FilterState {
  contractTypes: ('Month-to-month' | 'One year' | 'Two year')[];
  internetServices: ('DSL' | 'Fiber optic' | 'No')[];
  tenureRange: [number, number];
  monthlyChargesRange: [number, number];
  onlySeniorCitizens: boolean;
  searchQuery: string;
}

export interface MetricSummary {
  totalCustomers: number;
  churnCount: number;
  churnRate: number;
  avgMonthlyCharges: number;
  avgTenure: number;
  mrrTotal: number;
  atRiskRevenue: number;
  clvAvg: number;
}

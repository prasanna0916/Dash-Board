export interface SuperstoreRecord {
  orderId: string;
  orderDate: string;
  category: 'Technology' | 'Furniture' | 'Office Supplies';
  subCategory: string;
  region: 'East' | 'West' | 'Central' | 'South';
  sales: number;
  quantity: number;
  discount: number;
  profit: number;
  profitMargin: number;
}

export const SUPERSTORE_DATA: SuperstoreRecord[] = [
  { orderId: 'CA-2024-102', orderDate: '2024-03-12', category: 'Technology', subCategory: 'Phones', region: 'East', sales: 1249.95, quantity: 3, discount: 0.1, profit: 349.98, profitMargin: 28.0 },
  { orderId: 'CA-2024-103', orderDate: '2024-03-14', category: 'Furniture', subCategory: 'Chairs', region: 'West', sales: 719.78, quantity: 2, discount: 0.2, profit: 89.97, profitMargin: 12.5 },
  { orderId: 'CA-2024-104', orderDate: '2024-03-15', category: 'Office Supplies', subCategory: 'Storage', region: 'Central', sales: 228.40, quantity: 4, discount: 0.0, profit: 68.52, profitMargin: 30.0 },
  { orderId: 'CA-2024-105', orderDate: '2024-03-18', category: 'Furniture', subCategory: 'Tables', region: 'South', sales: 957.57, quantity: 5, discount: 0.45, profit: -383.03, profitMargin: -40.0 },
  { orderId: 'CA-2024-106', orderDate: '2024-03-20', category: 'Technology', subCategory: 'Accessories', region: 'East', sales: 399.96, quantity: 4, discount: 0.1, profit: 139.98, profitMargin: 35.0 },
  { orderId: 'CA-2024-107', orderDate: '2024-03-22', category: 'Technology', subCategory: 'Machines', region: 'Central', sales: 2177.84, quantity: 8, discount: 0.3, profit: -120.40, profitMargin: -5.5 },
  { orderId: 'CA-2024-108', orderDate: '2024-03-25', category: 'Office Supplies', subCategory: 'Paper', region: 'West', sales: 114.30, quantity: 6, discount: 0.0, profit: 54.86, profitMargin: 48.0 },
  { orderId: 'CA-2024-109', orderDate: '2024-03-28', category: 'Furniture', subCategory: 'Bookcases', region: 'East', sales: 619.90, quantity: 2, discount: 0.25, profit: -45.10, profitMargin: -7.2 },
  { orderId: 'CA-2024-110', orderDate: '2024-04-01', category: 'Technology', subCategory: 'Copiers', region: 'West', sales: 3399.98, quantity: 2, discount: 0.0, profit: 1529.99, profitMargin: 45.0 },
  { orderId: 'CA-2024-111', orderDate: '2024-04-04', category: 'Office Supplies', subCategory: 'Binders', region: 'Central', sales: 48.24, quantity: 3, discount: 0.2, profit: 15.43, profitMargin: 32.0 },
  { orderId: 'CA-2024-112', orderDate: '2024-04-08', category: 'Technology', subCategory: 'Phones', region: 'South', sales: 890.00, quantity: 2, discount: 0.15, profit: 213.60, profitMargin: 24.0 },
  { orderId: 'CA-2024-113', orderDate: '2024-04-12', category: 'Furniture', subCategory: 'Furnishings', region: 'West', sales: 184.20, quantity: 5, discount: 0.0, profit: 73.68, profitMargin: 40.0 },
];

export interface PenguinRecord {
  species: 'Adelie' | 'Gentoo' | 'Chinstrap';
  island: 'Torgersen' | 'Biscoe' | 'Dream';
  billLengthMm: number;
  billDepthMm: number;
  flipperLengthMm: number;
  bodyMassG: number;
  sex: 'MALE' | 'FEMALE';
}

export const PENGUINS_DATA: PenguinRecord[] = [
  { species: 'Adelie', island: 'Torgersen', billLengthMm: 39.1, billDepthMm: 18.7, flipperLengthMm: 181, bodyMassG: 3750, sex: 'MALE' },
  { species: 'Adelie', island: 'Torgersen', billLengthMm: 39.5, billDepthMm: 17.4, flipperLengthMm: 186, bodyMassG: 3800, sex: 'FEMALE' },
  { species: 'Adelie', island: 'Dream', billLengthMm: 40.3, billDepthMm: 18.0, flipperLengthMm: 195, bodyMassG: 3250, sex: 'FEMALE' },
  { species: 'Gentoo', island: 'Biscoe', billLengthMm: 46.1, billDepthMm: 13.2, flipperLengthMm: 211, bodyMassG: 4500, sex: 'FEMALE' },
  { species: 'Gentoo', island: 'Biscoe', billLengthMm: 50.0, billDepthMm: 16.3, flipperLengthMm: 230, bodyMassG: 5700, sex: 'MALE' },
  { species: 'Gentoo', island: 'Biscoe', billLengthMm: 48.7, billDepthMm: 14.1, flipperLengthMm: 210, bodyMassG: 4450, sex: 'FEMALE' },
  { species: 'Chinstrap', island: 'Dream', billLengthMm: 46.5, billDepthMm: 17.9, flipperLengthMm: 192, bodyMassG: 3500, sex: 'FEMALE' },
  { species: 'Chinstrap', island: 'Dream', billLengthMm: 50.0, billDepthMm: 19.5, flipperLengthMm: 196, bodyMassG: 3900, sex: 'MALE' },
  { species: 'Chinstrap', island: 'Dream', billLengthMm: 51.3, billDepthMm: 18.2, flipperLengthMm: 197, bodyMassG: 3750, sex: 'MALE' },
];

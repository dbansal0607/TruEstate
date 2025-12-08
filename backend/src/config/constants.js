/**
 * Application constants and configuration
 */

export const AGE_RANGES = {
  '18-25': { min: 18, max: 25 },
  '26-35': { min: 26, max: 35 },
  '36-45': { min: 36, max: 45 },
  '46-55': { min: 46, max: 55 },
  '56+': { min: 56, max: 150 }
};

export const ITEMS_PER_PAGE = 10;

export const SORT_FIELDS = {
  date: 'Date',
  quantity: 'Quantity',
  customerName: 'Customer Name'
};

export const SORT_ORDERS = {
  asc: 'asc',
  desc: 'desc'
};

export const FILTER_FIELDS = {
  region: 'Customer Region',
  gender: 'Gender',
  ageRange: 'Age',
  category: 'Product Category',
  tags: 'Tags',
  paymentMethod: 'Payment Method'
};

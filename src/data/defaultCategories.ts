import { SeededCategory } from '../types/finance';

// Default categories seeded on first run. IDs are stable keys used in code.
export const defaultCategories: SeededCategory[] = [
  {
    id: 'food',
    name: 'Food',
    type: 'expense',
    color: '#FF7043',
    icon: 'food',
    createdAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'transport',
    name: 'Transport',
    type: 'expense',
    color: '#29B6F6',
    icon: 'car',
    createdAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'bills',
    name: 'Bills',
    type: 'expense',
    color: '#AB47BC',
    icon: 'file-invoice',
    createdAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'shopping',
    name: 'Shopping',
    type: 'expense',
    color: '#FFA726',
    icon: 'shopping-bag',
    createdAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'medical',
    name: 'Medical',
    type: 'expense',
    color: '#66BB6A',
    icon: 'medical',
    createdAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'salary',
    name: 'Salary',
    type: 'income',
    color: '#66BB6A',
    icon: 'wallet',
    createdAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'bonus',
    name: 'Bonus',
    type: 'income',
    color: '#26A69A',
    icon: 'gift',
    createdAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'uncategorized',
    name: 'Uncategorized',
    type: 'both',
    color: '#BDBDBD',
    icon: 'question',
    createdAt: '2025-01-01T00:00:00.000Z',
  },
];

export default defaultCategories;

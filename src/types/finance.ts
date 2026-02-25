export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency?: string; // default: BDT
  categoryId?: string | null;
  paymentMethodId?: string | null;
  date: string; // ISO
  note?: string;
  attachments?: string[]; // local URIs or remote URLs
  createdAt: string;
  updatedAt?: string;
  isSynced?: boolean;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType | 'both';
  color?: string;
  icon?: string;
  createdAt: string;
}

export interface PaymentMethod {
  id: string;
  name: string; // e.g., Cash, Bkash, Card
  type?: string;
  createdAt: string;
}

export interface SeededCategory extends Category {}

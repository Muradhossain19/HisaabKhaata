import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction } from '../types/finance';

const STORAGE_KEY = 'hk_transactions_v1';

function makeId() {
  return `txn_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}

export async function getAllTransactions(): Promise<Transaction[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Transaction[];
    return parsed;
  } catch (e) {
    console.warn('getAllTransactions error', e);
    return [];
  }
}

export async function getUnsyncedTransactions(): Promise<Transaction[]> {
  const list = await getAllTransactions();
  return list.filter(t => !t.isSynced);
}

export async function updateTransaction(
  id: string,
  patch: Partial<Transaction>,
): Promise<Transaction | null> {
  const list = await getAllTransactions();
  const idx = list.findIndex(t => t.id === id);
  if (idx === -1) return null;
  const updated: Transaction = {
    ...list[idx],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  list[idx] = updated;
  await saveTransactions(list);
  return updated;
}

export async function saveTransactions(list: Transaction[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('saveTransactions error', e);
  }
}

export async function addTransaction(
  partial: Partial<Transaction>,
): Promise<Transaction> {
  const now = new Date().toISOString();
  const txn: Transaction = {
    id: partial.id ?? makeId(),
    type: (partial.type as Transaction['type']) ?? 'expense',
    amount: partial.amount ?? 0,
    currency: partial.currency ?? 'BDT',
    categoryId: partial.categoryId ?? null,
    paymentMethodId: partial.paymentMethodId ?? null,
    date: partial.date ?? now,
    note: partial.note ?? undefined,
    attachments: partial.attachments ?? undefined,
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
    isSynced: false,
  };

  const list = await getAllTransactions();
  list.unshift(txn);
  await saveTransactions(list);
  return txn;
}

export async function clearTransactions(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('clearTransactions error', e);
  }
}

export default {
  getAllTransactions,
  saveTransactions,
  addTransaction,
  clearTransactions,
};

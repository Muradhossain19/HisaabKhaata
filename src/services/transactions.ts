import { Transaction } from '../types/finance';
import api from './api';

type ApiTransaction = {
  id: number | string;
  client_id?: string | null;
  type: 'income' | 'expense';
  amount: number | string;
  currency?: string | null;
  category_id?: number | null;
  payment_method_id?: number | null;
  date?: string | null;
  note?: string | null;
  attachments?: string[] | string | null;
  created_at?: string;
  updated_at?: string;
};

function normalizeAttachments(a: ApiTransaction['attachments']): string[] | undefined {
  if (!a) return undefined;
  if (Array.isArray(a)) return a;
  if (typeof a === 'string') {
    try {
      const parsed = JSON.parse(a);
      return Array.isArray(parsed) ? parsed : undefined;
    } catch {
      return a.split(';').filter(Boolean);
    }
  }
  return undefined;
}

function mapApiToApp(t: ApiTransaction): Transaction {
  return {
    id: String(t.id),
    type: t.type,
    amount: typeof t.amount === 'string' ? Number(t.amount) : t.amount,
    currency: t.currency ?? 'BDT',
    categoryId: t.category_id != null ? String(t.category_id) : null,
    paymentMethodId:
      t.payment_method_id != null ? String(t.payment_method_id) : null,
    date: t.date ?? new Date().toISOString(),
    note: t.note ?? undefined,
    attachments: normalizeAttachments(t.attachments),
    createdAt: t.created_at ?? new Date().toISOString(),
    updatedAt: t.updated_at ?? undefined,
    isSynced: true,
  };
}

function mapAppToApi(partial: Partial<Transaction>) {
  return {
    client_id: partial.id ?? null,
    type: partial.type ?? 'expense',
    amount: partial.amount ?? 0,
    currency: partial.currency ?? 'BDT',
    category_id: partial.categoryId ? Number(partial.categoryId) : null,
    payment_method_id: partial.paymentMethodId
      ? Number(partial.paymentMethodId)
      : null,
    date: partial.date ?? null,
    note: partial.note ?? null,
    attachments: partial.attachments ?? null,
  };
}

export async function getAllTransactions(): Promise<Transaction[]> {
  try {
    const data: any = await api.get('/api/transactions');
    const rows: ApiTransaction[] = Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data)
        ? data
        : [];
    return rows.map(mapApiToApp);
  } catch (e) {
    console.warn('getAllTransactions error', e);
    return [];
  }
}

export async function getTransactions(params?: {
  from?: string;
  to?: string;
  type?: Transaction['type'];
  categoryId?: string | null;
  paymentMethodId?: string | null;
}): Promise<Transaction[]> {
  const qs: string[] = [];
  if (params?.from) qs.push(`from=${encodeURIComponent(params.from)}`);
  if (params?.to) qs.push(`to=${encodeURIComponent(params.to)}`);
  const path = qs.length ? `/api/transactions?${qs.join('&')}` : '/api/transactions';
  const rows = await getAllTransactionsFromPath(path);

  // Backend currently supports only from/to filtering; apply the rest client-side.
  return rows.filter(t => {
    if (params?.type && t.type !== params.type) return false;
    if (params?.categoryId != null && t.categoryId !== params.categoryId)
      return false;
    if (
      params?.paymentMethodId != null &&
      t.paymentMethodId !== params.paymentMethodId
    )
      return false;
    return true;
  });
}

async function getAllTransactionsFromPath(path: string): Promise<Transaction[]> {
  try {
    const data: any = await api.get(path);
    const rows: ApiTransaction[] = Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data)
        ? data
        : [];
    return rows.map(mapApiToApp);
  } catch (e) {
    console.warn('getAllTransactionsFromPath error', e);
    return [];
  }
}

export async function getUnsyncedTransactions(): Promise<Transaction[]> {
  // API-first mode: we don't keep a local unsynced queue here yet.
  return [];
}

export async function updateTransaction(
  id: string,
  patch: Partial<Transaction>,
): Promise<Transaction | null> {
  try {
    const data: any = await api.put(`/api/transactions/${id}`, mapAppToApi(patch));
    return mapApiToApp(data);
  } catch (e) {
    console.warn('updateTransaction error', e);
    return null;
  }
}

export async function saveTransactions(_list: Transaction[]): Promise<void> {
  // API-first mode: no-op (server is source of truth).
}

export async function addTransaction(
  partial: Partial<Transaction>,
): Promise<Transaction> {
  const data: any = await api.post('/api/transactions', mapAppToApi(partial));
  return mapApiToApp(data);
}

export async function deleteTransaction(id: string): Promise<boolean> {
  try {
    await api.del(`/api/transactions/${id}`);
    return true;
  } catch (e) {
    console.warn('deleteTransaction error', e);
    return false;
  }
}

export async function clearTransactions(): Promise<void> {
  // Not supported in API-first mode.
}

export default {
  getAllTransactions,
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
};

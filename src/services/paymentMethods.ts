import api from './api';
import { PaymentMethod } from '../types/finance';

type ApiPaymentMethod = {
  id: number | string;
  name: string;
  type?: string | null;
  created_at?: string;
};

function mapApiToApp(p: ApiPaymentMethod): PaymentMethod {
  return {
    id: String(p.id),
    name: p.name,
    type: p.type ?? undefined,
    createdAt: p.created_at ?? new Date().toISOString(),
  };
}

export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  const data: any = await api.get('/api/payment-methods');
  const rows: ApiPaymentMethod[] = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data)
      ? data
      : [];
  return rows.map(mapApiToApp);
}

export async function createPaymentMethod(input: {
  name: string;
  type?: string;
}): Promise<PaymentMethod> {
  const data: any = await api.post('/api/payment-methods', input);
  return mapApiToApp(data);
}

export async function updatePaymentMethod(
  id: string,
  input: { name: string; type?: string },
): Promise<PaymentMethod> {
  const data: any = await api.put(`/api/payment-methods/${id}`, input);
  return mapApiToApp(data);
}

export async function deletePaymentMethod(id: string): Promise<void> {
  await api.del(`/api/payment-methods/${id}`);
}

export default {
  getPaymentMethods,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
};


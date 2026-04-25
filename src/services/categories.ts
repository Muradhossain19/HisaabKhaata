import api from './api';
import { Category } from '../types/finance';

type ApiCategory = {
  id: number | string;
  name: string;
  type: 'income' | 'expense' | 'both';
  color?: string | null;
  icon?: string | null;
  created_at?: string;
};

function mapApiToApp(c: ApiCategory): Category {
  return {
    id: String(c.id),
    name: c.name,
    type: c.type,
    color: c.color ?? undefined,
    icon: c.icon ?? undefined,
    createdAt: c.created_at ?? new Date().toISOString(),
  };
}

export async function getCategories(): Promise<Category[]> {
  const data: any = await api.get('/api/categories');
  const rows: ApiCategory[] = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data)
      ? data
      : [];
  return rows.map(mapApiToApp);
}

export async function createCategory(input: {
  name: string;
  type: 'income' | 'expense' | 'both';
  color?: string;
  icon?: string;
}): Promise<Category> {
  const data: any = await api.post('/api/categories', input);
  return mapApiToApp(data);
}

export async function updateCategory(
  id: string,
  input: {
    name: string;
    type: 'income' | 'expense' | 'both';
    color?: string;
    icon?: string;
  },
): Promise<Category> {
  const data: any = await api.put(`/api/categories/${id}`, input);
  return mapApiToApp(data);
}

export async function deleteCategory(id: string): Promise<void> {
  await api.del(`/api/categories/${id}`);
}

export default { getCategories, createCategory, updateCategory, deleteCategory };


import api from './api';

export type PartySummary = {
  id: string;
  name: string;
  phone?: string;
  due: number;
};

type ApiParty = {
  id: number | string;
  name: string;
  phone?: string | null;
  due?: number | string | null;
};

function mapParty(p: ApiParty): PartySummary {
  return {
    id: String(p.id),
    name: p.name,
    phone: p.phone ?? undefined,
    due: p.due == null ? 0 : typeof p.due === 'string' ? Number(p.due) : p.due,
  };
}

export async function getParties(): Promise<PartySummary[]> {
  const data: any = await api.get('/api/parties');
  const rows: ApiParty[] = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data)
      ? data
      : [];
  return rows.map(mapParty);
}

export async function createParty(input: {
  name: string;
  phone?: string;
  notes?: string;
}): Promise<PartySummary> {
  const data: any = await api.post('/api/parties', input);
  return mapParty({ ...data, due: 0 });
}

export default { getParties, createParty };


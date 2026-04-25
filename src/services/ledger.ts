import api from './api';

export type PartyHeader = {
  id: string;
  name: string;
  phone?: string;
};

export type LedgerEntry = {
  id: string;
  direction: 'you_get' | 'you_give';
  amount: number;
  date: string;
  note?: string;
};

type ApiLedgerEntry = {
  id: number | string;
  direction: 'you_get' | 'you_give';
  amount: number | string;
  date: string;
  note?: string | null;
};

export async function getLedger(partyId: string): Promise<{
  party: PartyHeader;
  entries: LedgerEntry[];
}> {
  const data: any = await api.get(`/api/parties/${partyId}/ledger`);
  const partyRaw = data?.party ?? data?.data?.party ?? {};
  const entriesRaw: ApiLedgerEntry[] =
    data?.entries ?? data?.data?.entries ?? data?.data ?? [];

  const party: PartyHeader = {
    id: String(partyRaw.id ?? partyId),
    name: String(partyRaw.name ?? 'Party'),
    phone: partyRaw.phone ?? undefined,
  };

  const entries: LedgerEntry[] = (Array.isArray(entriesRaw) ? entriesRaw : []).map(
    e => ({
      id: String(e.id),
      direction: e.direction,
      amount: typeof e.amount === 'string' ? Number(e.amount) : e.amount,
      date: e.date,
      note: e.note ?? undefined,
    }),
  );

  return { party, entries };
}

export async function addLedgerEntry(
  partyId: string,
  input: { direction: 'you_get' | 'you_give'; amount: number; date?: string; note?: string },
): Promise<LedgerEntry> {
  const data: any = await api.post(`/api/parties/${partyId}/ledger`, input);
  return {
    id: String(data.id),
    direction: data.direction,
    amount: typeof data.amount === 'string' ? Number(data.amount) : data.amount,
    date: data.date,
    note: data.note ?? undefined,
  };
}

export default { getLedger, addLedgerEntry };


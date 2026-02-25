import { Transaction } from '../types/finance';
import { Share } from 'react-native';

function toCSV(rows: Transaction[]) {
  const header = [
    'id',
    'type',
    'amount',
    'currency',
    'categoryId',
    'paymentMethodId',
    'date',
    'note',
    'attachments',
    'createdAt',
  ];
  const lines = [header.join(',')];
  for (const r of rows) {
    const row = [
      r.id,
      r.type,
      r.amount,
      r.currency ?? '',
      r.categoryId ?? '',
      r.paymentMethodId ?? '',
      r.date,
      '"' + (r.note || '').replace(/"/g, '""') + '"',
      '"' + (r.attachments || []).join(';') + '"',
      r.createdAt,
    ];
    lines.push(row.join(','));
  }
  return lines.join('\n');
}

export async function shareTransactionsCSV(rows: Transaction[]) {
  const csv = toCSV(rows);
  try {
    await Share.share({ message: csv, title: 'Transactions.csv' });
  } catch (e) {
    console.warn('share error', e);
  }
}

export default { shareTransactionsCSV };

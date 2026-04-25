import { Transaction } from '../types/finance';
import { Share } from 'react-native';
import RNPrint from 'react-native-print';

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
    await Share.share({
      title: 'Transactions.csv',
      message: csv,
    });
  } catch (e) {
    console.warn('share error', e);
  }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function shareTransactionsPDF(opts: {
  title: string;
  rows: Transaction[];
  currency?: string;
  totals?: { income: number; expense: number; balance: number };
}) {
  const { title, rows, currency = 'BDT', totals } = opts;
  const now = new Date().toISOString();

  const header = `
    <div style="display:flex;justify-content:space-between;align-items:flex-end;">
      <div>
        <div style="font-size:20px;font-weight:700;">${escapeHtml(title)}</div>
        <div style="font-size:12px;color:#64748b;margin-top:4px;">Generated: ${escapeHtml(
          now,
        )}</div>
      </div>
      <div style="font-size:12px;color:#64748b;">Currency: ${escapeHtml(
        currency,
      )}</div>
    </div>
  `;

  const totalsHtml = totals
    ? `
    <div style="display:flex;gap:12px;margin-top:14px;">
      <div style="flex:1;border:1px solid #e2e8f0;border-radius:12px;padding:12px;">
        <div style="color:#64748b;font-size:12px;">Income</div>
        <div style="font-size:18px;font-weight:700;color:#16a34a;margin-top:4px;">${totals.income.toFixed(
          2,
        )}</div>
      </div>
      <div style="flex:1;border:1px solid #e2e8f0;border-radius:12px;padding:12px;">
        <div style="color:#64748b;font-size:12px;">Expense</div>
        <div style="font-size:18px;font-weight:700;color:#dc2626;margin-top:4px;">${totals.expense.toFixed(
          2,
        )}</div>
      </div>
      <div style="flex:1;border:1px solid #e2e8f0;border-radius:12px;padding:12px;">
        <div style="color:#64748b;font-size:12px;">Balance</div>
        <div style="font-size:18px;font-weight:700;color:#0f172a;margin-top:4px;">${totals.balance.toFixed(
          2,
        )}</div>
      </div>
    </div>
  `
    : '';

  const rowsHtml = rows
    .map(r => {
      const sign = r.type === 'income' ? '+' : '-';
      const color = r.type === 'income' ? '#16a34a' : '#dc2626';
      return `
        <tr>
          <td style="padding:10px;border-bottom:1px solid #f1f5f9;">${escapeHtml(
            new Date(r.date).toLocaleDateString(),
          )}</td>
          <td style="padding:10px;border-bottom:1px solid #f1f5f9;">${escapeHtml(
            r.type,
          )}</td>
          <td style="padding:10px;border-bottom:1px solid #f1f5f9;color:${color};font-weight:700;text-align:right;">${sign}${Number(
            r.amount,
          ).toFixed(2)}</td>
          <td style="padding:10px;border-bottom:1px solid #f1f5f9;">${escapeHtml(
            r.note ?? '',
          )}</td>
        </tr>
      `;
    })
    .join('');

  const html = `
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial; padding:18px; color:#0f172a;">
      ${header}
      ${totalsHtml}
      <div style="margin-top:16px;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;">
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="background:#f8fafc;">
              <th style="text-align:left;padding:10px;font-size:12px;color:#475569;">Date</th>
              <th style="text-align:left;padding:10px;font-size:12px;color:#475569;">Type</th>
              <th style="text-align:right;padding:10px;font-size:12px;color:#475569;">Amount</th>
              <th style="text-align:left;padding:10px;font-size:12px;color:#475569;">Note</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    </body>
  </html>
  `;

  try {
    const filePath = await RNPrint.printToFile({ html });
    await Share.share({
      title: `${title}.pdf`,
      url: filePath.filePath,
    } as any);
  } catch (e) {
    console.warn('pdf share error', e);
    throw e;
  }
}

export default { shareTransactionsCSV, shareTransactionsPDF };

import api from './api';
import transactionsService from './transactions';
import { Transaction } from '../types/finance';

/**
 * Sync service:
 * - finds unsynced transactions
 * - uploads attachments first (if needed)
 * - posts each transaction to /api/transactions
 * - updates local record (isSynced=true, replace id if server returns new id)
 */

export async function syncOnce(): Promise<{ ok: number; failed: number }> {
  const unsynced = await transactionsService.getUnsyncedTransactions();
  let ok = 0;
  let failed = 0;

  for (const t of unsynced) {
    try {
      const payload: any = { ...t };

      // handle attachments: if attachment URIs look local (not http), upload and replace with URLs
      if (t.attachments && t.attachments.length) {
        const uploaded: string[] = [];
        for (const a of t.attachments) {
          if (a.startsWith('http://') || a.startsWith('https://')) {
            uploaded.push(a);
            continue;
          }
          const res = await api.uploadFile(a);
          if (res && res.url) uploaded.push(res.url);
        }
        payload.attachments = uploaded;
      }

      // Post transaction
      const res = await api.postTransaction(payload);
      // Expecting created transaction object in response
      if (res && (res.id || res.data)) {
        const serverTxn = res.data ?? res;
        // replace local record: mark synced and replace id if server id provided
        const patch: Partial<Transaction> = {
          isSynced: true,
          updatedAt: new Date().toISOString(),
        };
        if (serverTxn.id && serverTxn.id !== t.id) {
          // keep both id and server id mapping by replacing id
          patch.id = serverTxn.id as any;
        }
        if (serverTxn.attachments) patch.attachments = serverTxn.attachments;

        await transactionsService.updateTransaction(t.id, patch as any);
        ok++;
      } else {
        failed++;
      }
    } catch (e) {
      console.warn('sync tx error', t.id, e);
      failed++;
    }
  }

  return { ok, failed };
}

export default { syncOnce };

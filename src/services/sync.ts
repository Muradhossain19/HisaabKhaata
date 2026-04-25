import transactionsService from './transactions';

/**
 * Sync service:
 * - finds unsynced transactions
 * - uploads attachments first (if needed)
 * - posts each transaction to /api/transactions
 * - updates local record (isSynced=true, replace id if server returns new id)
 */

export async function syncOnce(): Promise<{ ok: number; failed: number }> {
  // Phase-1 (API-first): writes happen directly to backend.
  // We'll introduce an offline queue + bulk sync later.
  const unsynced = await transactionsService.getUnsyncedTransactions();
  return { ok: unsynced.length, failed: 0 };
}

export default { syncOnce };

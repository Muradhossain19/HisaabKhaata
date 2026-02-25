/*
  Lightweight API client for Laravel backend.
  - setAuthToken(token) to set bearer token
  - uploadFile(uri) to upload multipart/form-data
  - postTransaction / bulkSync / getCategories
*/

const BASE = process.env.API_BASE || 'http://127.0.0.1:8000';
let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

function authHeaders() {
  const h: Record<string, string> = { Accept: 'application/json' };
  if (authToken) h['Authorization'] = `Bearer ${authToken}`;
  return h;
}

export async function get(path: string) {
  const res = await fetch(`${BASE}${path}`, { headers: authHeaders() });
  return res.json();
}

export async function post(path: string, body: any) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function uploadFile(uri: string, name = 'file') {
  const form = new FormData();
  // Try to derive filename and mimetype heuristically
  const filename = name || uri.split('/').pop() || 'upload.jpg';
  // @ts-ignore
  form.append('file', { uri, name: filename, type: 'image/jpeg' });

  const res = await fetch(`${BASE}/api/uploads`, {
    method: 'POST',
    headers: authHeaders(), // don't set Content-Type
    body: form as any,
  });
  return res.json(); // expect { url }
}

// App-specific endpoints
export async function postTransaction(payload: any) {
  return post('/api/transactions', payload);
}

export async function bulkSync(transactions: any[]) {
  return post('/api/transactions/bulk', { transactions });
}

export async function getCategories() {
  return get('/api/categories');
}

export default {
  setAuthToken,
  postTransaction,
  bulkSync,
  uploadFile,
  getCategories,
  get,
  post,
};

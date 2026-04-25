import apiClient, { setAuthToken } from '../api/client';

export { setAuthToken };

export async function get<T = any>(path: string) {
  const res = await apiClient.get<T>(path);
  return res.data;
}

export async function post<T = any>(path: string, body: any) {
  const res = await apiClient.post<T>(path, body);
  return res.data;
}

export async function put<T = any>(path: string, body: any) {
  const res = await apiClient.put<T>(path, body);
  return res.data;
}

export async function del<T = any>(path: string) {
  const res = await apiClient.delete<T>(path);
  return res.data;
}

export async function uploadFile(uri: string, name = 'file') {
  const form = new FormData();
  const filename = name || uri.split('/').pop() || 'upload.jpg';
  // @ts-ignore - React Native file object
  form.append('file', { uri, name: filename, type: 'image/jpeg' });
  const res = await apiClient.post('/api/uploads', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data; // expect { url }
}


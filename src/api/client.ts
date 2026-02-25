import axios from 'axios';
import { Platform } from 'react-native';
import authStorage from '../utils/authStorage';

// Determine base URL with overrides for common RN environments:
// 1) global.__API_URL__ - settable at runtime for debugging
// 2) process.env.API_URL - if you inject env vars in Metro/Babel
// 3) emulator-specific defaults: Android emulator -> 10.0.2.2, iOS simulator -> localhost
export const getBaseUrl = () => {
  // runtime override (useful when testing on a device)
  // Use globalThis where available (TypeScript recognizes it). Avoid direct 'global' reference.
  const runtimeGlobal: any =
    typeof globalThis !== 'undefined' ? globalThis : undefined;
  if (runtimeGlobal && runtimeGlobal.__API_URL__)
    return runtimeGlobal.__API_URL__;

  // Emulator defaults
  if (Platform.OS === 'android') return 'http://10.0.2.2:8088';
  return 'http://localhost:8088';
};

const apiClient = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Attach token from storage if present
try {
  const existingToken = authStorage.getToken();
  if (existingToken) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${existingToken}`;
  }
} catch {
  // ignore storage errors
}

// Improve logging to make network errors obvious during development
apiClient.interceptors.request.use(request => {
  try {
    console.log(
      `[api][request] ${request.method?.toUpperCase()} ${request.baseURL}${
        request.url
      }`,
    );
  } catch {
    // ignore
  }
  return request;
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    try {
      console.log('[api][error]', {
        message: error?.message,
        url: error?.config && `${error.config.baseURL}${error.config.url}`,
        status: error?.response?.status,
        data: error?.response?.data,
      });
    } catch {
      // ignore logging errors
    }
    return Promise.reject(error);
  },
);

export function setAuthToken(token?: string | null) {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
    try {
      authStorage.setToken(token);
    } catch {
      // ignore
    }
  } else {
    delete apiClient.defaults.headers.common.Authorization;
    try {
      authStorage.clearToken();
    } catch {
      // ignore
    }
  }
}

export default apiClient;

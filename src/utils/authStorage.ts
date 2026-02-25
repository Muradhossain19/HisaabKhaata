import type { MMKV as MMKVType } from 'react-native-mmkv';

let storage:
  | {
      getString: (k: string) => string | undefined | null;
      set: (k: string, v: string) => void;
      delete: (k: string) => void;
    }
  | undefined;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const rn = require('react-native-mmkv') as {
    MMKV?: new (opts?: any) => MMKVType;
  };
  if (rn && typeof rn.MMKV === 'function') {
    // @ts-ignore runtime constructor
    storage = new rn.MMKV({ id: 'hisaabkhaata_auth' });
  }
} catch (e) {
  // ignore
}

if (!storage) {
  const map = new Map<string, string>();
  storage = {
    getString: (k: string) => (map.has(k) ? (map.get(k) as string) : undefined),
    set: (k: string, v: string) => {
      map.set(k, v);
    },
    delete: (k: string) => {
      map.delete(k);
    },
  };
}

export const getToken = (): string | undefined => {
  const v = storage!.getString('auth_token');
  return v || undefined;
};

export const setToken = (token: string) => {
  storage!.set('auth_token', token);
};

export const clearToken = () => {
  storage!.delete('auth_token');
};

export default { getToken, setToken, clearToken };

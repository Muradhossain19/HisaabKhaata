import type { MMKV as MMKVType } from 'react-native-mmkv';

let storage:
  | {
      getString: (k: string) => string | undefined | null;
      set: (k: string, v: string) => void;
    }
  | undefined;

try {
  // Try to load native MMKV. In some environments (tests, metro-hot reload) the
  // native constructor may be unavailable — guard against that and fallback.
  // Use require so TypeScript doesn't complain about 'only refers to a type'.

  const rn = require('react-native-mmkv') as {
    MMKV?: new (opts?: any) => MMKVType;
  };
  if (rn && typeof rn.MMKV === 'function') {
    // @ts-ignore - runtime constructor
    storage = new rn.MMKV({ id: 'hisaabkhaata' });
  }
} catch {
  // ignore — will assign fallback below
}

// Fallback in-memory storage when MMKV isn't available at runtime.
if (!storage) {
  const store = new Map<string, string>();
  storage = {
    getString: (k: string) =>
      store.has(k) ? (store.get(k) as string) : undefined,
    set: (k: string, v: string) => {
      store.set(k, v);
    },
  };
}

export const getLang = (): 'bn' | 'en' | undefined => {
  const v = storage.getString('lang');
  if (v === 'en') return 'en';
  if (v === 'bn') return 'bn';
  return undefined;
};

export const setLang = (l: 'bn' | 'en') => {
  storage.set('lang', l);
};

export default { getLang, setLang };

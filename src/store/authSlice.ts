import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient, { setAuthToken } from '../api/client';
import authStorage from '../utils/authStorage';

type User = {
  id: number | null;
  name?: string;
  email?: string;
  phone?: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  token: authStorage.getToken() ?? null,
  loading: false,
  error: null,
};

// Placeholder async thunks (replace with real API calls later)
export const registerUser = createAsyncThunk(
  'auth/register',
  async (
    payload: {
      name: string;
      email: string;
      phone: string;
      password: string;
      password_confirmation?: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const resp = await apiClient.post('/api/register', payload);
      const data = resp.data;
      // Laravel apps often return token under `token` or `access_token`
      const token = data.token || data.access_token || data?.data?.token;
      const user = data.user || data.data || data;
      return { user, token };
    } catch (err: any) {
      // log full error for Metro console
      try {
        console.log('[auth][register][error]', {
          message: err?.message,
          code: err?.code,
          status: err?.response?.status,
          data: err?.response?.data,
        });
      } catch {}

      const errPayload = {
        message:
          err?.response?.data?.message || err.message || 'Registration failed',
        status: err?.response?.status ?? null,
        data: err?.response?.data ?? null,
        code: err?.code ?? null,
      };
      return rejectWithValue(errPayload);
    }
  },
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (payload: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const resp = await apiClient.post('/api/login', payload);
      const data = resp.data;
      const token = data.token || data.access_token || data?.data?.token;
      const user = data.user || data.data || data;
      return { user, token };
    } catch (err: any) {
      try {
        console.log('[auth][login][error]', {
          message: err?.message,
          code: err?.code,
          status: err?.response?.status,
          data: err?.response?.data,
        });
      } catch {}

      const errPayload = {
        message: err?.response?.data?.message || err.message || 'Login failed',
        status: err?.response?.status ?? null,
        data: err?.response?.data ?? null,
        code: err?.code ?? null,
      };
      return rejectWithValue(errPayload);
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      try {
        setAuthToken(undefined);
      } catch {
        // ignore
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(registerUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        try {
          if (action.payload.token) setAuthToken(action.payload.token);
        } catch {
          // ignore
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        // prefer rejectWithValue payload when available
        const payload = (action as any).payload as unknown;
        state.error =
          payload && typeof payload === 'string'
            ? payload
            : action.error.message ?? 'Registration failed';
      })
      .addCase(loginUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        try {
          if (action.payload.token) setAuthToken(action.payload.token);
        } catch {
          // ignore
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        // prefer rejectWithValue payload when available
        const payload = (action as any).payload as unknown;
        state.error =
          payload && typeof payload === 'string'
            ? payload
            : action.error.message ?? 'Login failed';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

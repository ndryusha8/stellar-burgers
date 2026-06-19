import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TUser } from '@utils-types';
import { fetchUser, login, logout, register, updateUser } from '../thunks';
import { getCookie } from '../../utils/cookie';
import type { RootState } from '../store';

type TStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export type AuthState = {
  user: TUser | null;
  status: TStatus;
  error: string | null;
  isAuthenticated: boolean;
  isAuthChecked: boolean;
};

const initialState: AuthState = {
  user: null,
  status: 'idle',
  error: null,
  isAuthenticated: false,
  isAuthChecked: false
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthFromCookie: (state) => {
      const accessToken = getCookie('accessToken');
      state.isAuthenticated = Boolean(accessToken);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.isAuthChecked = false;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = 'failed';
        state.user = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
        state.error = action.error.message || 'Ошибка получения пользователя';
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(updateUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          action.error.message || 'Ошибка сохранения данных пользователя';
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.status = 'idle';
        state.error = null;
      });
  }
});

export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectAuthState = (state: RootState) => state.auth;

export const { setAuthFromCookie } = authSlice.actions;

export default authSlice.reducer;

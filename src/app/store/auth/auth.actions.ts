import { createAction, props } from '@ngrx/store';

// Login Actions
export const login = createAction(
  '[Auth] Login',
  props<{ mobile: string; otp: string; trxRef?: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ token: string }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

// Logout Actions
export const logout = createAction('[Auth] Logout');

export const logoutSuccess = createAction('[Auth] Logout Success');

// Token Actions
export const setToken = createAction(
  '[Auth] Set Token',
  props<{ token: string }>()
);

export const clearToken = createAction('[Auth] Clear Token');

// Load Token from Storage
export const loadToken = createAction('[Auth] Load Token');

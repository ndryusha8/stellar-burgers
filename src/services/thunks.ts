import {
  getFeedsApi,
  getIngredientsApi,
  getOrdersApi,
  getOrderByNumberApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  orderBurgerApi,
  registerUserApi,
  updateUserApi
} from '@api';

import type { TOrder, TOrdersData, TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../utils/cookie';

import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async () => {
    const data = await getIngredientsApi();
    return data;
  }
);

export const fetchFeeds = createAsyncThunk(
  'feeds/fetchFeeds',
  async (): Promise<TOrdersData> => {
    const data = await getFeedsApi();
    return data;
  }
);

export const fetchProfileOrders = createAsyncThunk(
  'orders/fetchProfileOrders',
  async (): Promise<TOrder[]> => {
    const orders = await getOrdersApi();
    return orders;
  }
);

export const getOrderByNumber = createAsyncThunk(
  'orders/getOrderByNumber',
  async (number: number): Promise<TOrder> => {
    const res = await getOrderByNumberApi(number);
    return res.orders[0];
  }
);

export const fetchUser = createAsyncThunk('auth/fetchUser', async () => {
  const res = await getUserApi();
  return res.user;
});

export const login = createAsyncThunk(
  'auth/login',
  async (data: { email: string; password: string }) => {
    const res = await loginUserApi(data);
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res.user;
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (data: { email: string; name: string; password: string }) => {
    const res = await registerUserApi(data);
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res.user;
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredients: string[]): Promise<number> => {
    const res = await orderBurgerApi(ingredients);
    return res.order.number;
  }
);

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (data: { name: string; email: string; password?: string }) => {
    const payload: { name: string; email: string; password?: string } = {
      name: data.name,
      email: data.email
    };

    if (data.password) {
      payload.password = data.password;
    }

    const res = await updateUserApi(payload);
    return res.user;
  }
);

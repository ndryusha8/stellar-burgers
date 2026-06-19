import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TOrder } from '@utils-types';
import { fetchProfileOrders, getOrderByNumber } from '../thunks';
import type { RootState } from '../store';

type TStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export type OrdersState = {
  orders: TOrder[];
  status: TStatus;
  error: string | null;
};

const initialState: OrdersState = {
  orders: [],
  status: 'idle',
  error: null
};

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileOrders.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(
        fetchProfileOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.status = 'succeeded';
          state.orders = action.payload || [];
        }
      )
      .addCase(fetchProfileOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Ошибка загрузки заказов';
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const order = action.payload;

        if (order && order.number) {
          const exists = state.orders.some((o) => o?.number === order.number);
          if (!exists) {
            state.orders = [order, ...(state.orders || [])];
          } else {
            state.orders = (state.orders || []).map((o) =>
              o?.number === order.number ? order : o
            );
          }
        } else {
          state.status = 'failed';
          state.error = 'Получен некорректный заказ';
        }
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Ошибка загрузки заказа';
      });
  }
});

export const selectOrders = (state: RootState) => state.orders.orders;
export const selectOrdersStatus = (state: RootState) => state.orders.status;
export const selectOrdersError = (state: RootState) => state.orders.error;
export const selectOrderByNumber = (state: RootState, number: number) =>
  state.orders.orders.find((order) => order.number === number);

export default ordersSlice.reducer;

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { createOrder } from '../thunks';
import type { RootState } from '../store';

export type OrderRequestState = {
  isLoading: boolean;
  error: string | null;
  orderNumber: number | null;
};

const initialState: OrderRequestState = {
  isLoading: false,
  error: null,
  orderNumber: null
};

export const orderRequestSlice = createSlice({
  name: 'orderRequest',
  initialState,
  reducers: {
    clearOrderNumber: (state) => {
      state.orderNumber = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.orderNumber = null;
      })
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.isLoading = false;
          state.orderNumber = action.payload;
        }
      )
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка оформления заказа';
      });
  }
});

export const selectOrderLoading = (state: RootState) =>
  state.orderRequest.isLoading;
export const selectOrderError = (state: RootState) => state.orderRequest.error;
export const selectOrderNumber = (state: RootState) =>
  state.orderRequest.orderNumber;

export const { clearOrderNumber } = orderRequestSlice.actions;

export default orderRequestSlice.reducer;

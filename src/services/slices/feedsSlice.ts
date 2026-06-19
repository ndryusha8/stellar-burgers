import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TOrdersData, TOrder } from '@utils-types';
import { fetchFeeds } from '../thunks';
import type { RootState } from '../store';

type TStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export type FeedsState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  status: TStatus;
  error: string | null;
};

const initialState: FeedsState = {
  orders: [],
  total: 0,
  totalToday: 0,
  status: 'idle',
  error: null
};

export const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(
        fetchFeeds.fulfilled,
        (state, action: PayloadAction<TOrdersData>) => {
          state.status = 'succeeded';
          state.orders = action.payload?.orders || [];
          state.total = action.payload?.total || 0;
          state.totalToday = action.payload?.totalToday || 0;
        }
      )
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Ошибка загрузки ленты';
      });
  }
});

export const selectFeedsOrders = (state: RootState) => state.feeds.orders;
export const selectFeedsTotal = (state: RootState) => state.feeds.total;
export const selectFeedsTotalToday = (state: RootState) =>
  state.feeds.totalToday;
export const selectFeedsStatus = (state: RootState) => state.feeds.status;
export const selectFeedsError = (state: RootState) => state.feeds.error;

export default feedsSlice.reducer;

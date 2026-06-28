import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import authReducer from './slices/authSlice';
import burgerConstructorReducer from './slices/burgerConstructorSlice';
import feedsReducer from './slices/feedsSlice';
import ingredientsReducer from './slices/ingredientsSlice';
import orderRequestReducer from './slices/orderRequestSlice';
import ordersReducer from './slices/ordersSlice';

export * from './thunks';

export * from './slices/authSlice';
export * from './slices/burgerConstructorSlice';
export * from './slices/feedsSlice';
export * from './slices/ingredientsSlice';
export * from './slices/orderRequestSlice';
export * from './slices/ordersSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  burgerConstructor: burgerConstructorReducer,
  feeds: feedsReducer,
  ingredients: ingredientsReducer,
  orderRequest: orderRequestReducer,
  orders: ordersReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;

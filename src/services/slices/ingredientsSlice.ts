import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TIngredient } from '@utils-types';
import { fetchIngredients } from '../thunks';
import type { RootState } from '../store';

type TStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export type IngredientsState = {
  ingredients: TIngredient[];
  status: TStatus;
  error: string | null;
};

const initialState: IngredientsState = {
  ingredients: [],
  status: 'idle',
  error: null
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(
        fetchIngredients.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          state.status = 'succeeded';
          state.ingredients = action.payload;
        }
      )
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Ошибка загрузки ингредиентов';
      });
  }
});

export const selectIngredients = (state: RootState) =>
  state.ingredients.ingredients;
export const selectIngredientsStatus = (state: RootState) =>
  state.ingredients.status;
export const selectIngredientsError = (state: RootState) =>
  state.ingredients.error;
export const selectIngredientById = (state: RootState, id: string) =>
  state.ingredients.ingredients.find((item) => item._id === id);

export default ingredientsSlice.reducer;

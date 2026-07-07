import type { AnyAction } from '@reduxjs/toolkit';

import ingredientsReducer from '../ingredientsSlice';
import burgerConstructorReducer, {
  addIngredient,
  clearConstructor,
  moveIngredient,
  removeIngredient
} from '../burgerConstructorSlice';
import { fetchIngredients } from '../../thunks';

type TIngredient = {
  _id: string;
  name: string;
  type: 'bun' | 'sauce' | 'main' | string;
  proteins: string;
  fat: string;
  carbohydrates: string;
  calories: number;
  price: number;
  image: string;
  image_mobile: string;
  image_large: string;
};

const bun: TIngredient = {
  _id: 'bun-1',
  name: 'Краторная булка',
  type: 'bun',
  proteins: '16',
  fat: '12',
  carbohydrates: '50',
  calories: 1200,
  price: 100,
  image: 'bun.png',
  image_mobile: 'bun-mobile.png',
  image_large: 'bun-large.png'
};

const filling: TIngredient = {
  _id: 'filling-1',
  name: 'Филе Люкс',
  type: 'main',
  proteins: '24',
  fat: '18',
  carbohydrates: '0',
  calories: 800,
  price: 70,
  image: 'filling.png',
  image_mobile: 'filling-mobile.png',
  image_large: 'filling-large.png'
};

describe('редьюсеры: ingredientsSlice + burgerConstructorSlice', () => {
  describe('ingredientsSlice', () => {
    it('должен быть функцией для неизвестного экшена с начальным состоянием undefined', () => {
      const state = ingredientsReducer(undefined, {
        type: 'UNKNOWN'
      } as AnyAction);
      expect(state).toEqual({
        ingredients: [],
        status: 'idle',
        error: null
      });
    });

    it('должен обрабатывать fetchIngredients.pending', () => {
      const prev = ingredientsReducer(undefined, {
        type: 'UNKNOWN'
      } as AnyAction);

      const action = { type: fetchIngredients.pending.type } as AnyAction;
      const next = ingredientsReducer(prev, action);

      expect(next.status).toBe('loading');
      expect(next.error).toBeNull();
    });

    it('должен обрабатывать fetchIngredients.fulfilled', () => {
      const prev = ingredientsReducer(undefined, {
        type: 'UNKNOWN'
      } as AnyAction);

      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: [bun]
      } as AnyAction;

      const next = ingredientsReducer(prev, action);

      expect(next.status).toBe('succeeded');
      expect(next.ingredients).toHaveLength(1);
      expect(next.ingredients[0]._id).toBe('bun-1');
    });

    it('должен обрабатывать fetchIngredients.rejected', () => {
      const prev = ingredientsReducer(undefined, {
        type: 'UNKNOWN'
      } as AnyAction);

      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: 'Network error' }
      } as AnyAction;

      const next = ingredientsReducer(prev, action);

      expect(next.status).toBe('failed');
      expect(next.error).toBe('Network error');
    });
  });

  describe('burgerConstructorSlice', () => {
    it('должен быть функцией для неизвестного экшена с начальным состоянием undefined', () => {
      const state = burgerConstructorReducer(undefined, {
        type: 'UNKNOWN'
      } as AnyAction);
      expect(state).toEqual({
        bun: null,
        ingredients: []
      });
    });

    it('должен обрабатывать addIngredient (булка)', () => {
      const prev = burgerConstructorReducer(undefined, {
        type: 'UNKNOWN'
      } as AnyAction);

      const action = addIngredient(bun as any);
      const next = burgerConstructorReducer(prev, action);

      expect(next.bun).not.toBeNull();
      expect(next.bun?._id).toBe('bun-1');
      expect(next.ingredients).toHaveLength(0);
    });

    it('должен обрабатывать addIngredient (не булка)', () => {
      const prev = burgerConstructorReducer(undefined, {
        type: 'UNKNOWN'
      } as AnyAction);

      const action = addIngredient(filling as any);
      const next = burgerConstructorReducer(prev, action);

      expect(next.bun).toBeNull();
      expect(next.ingredients).toHaveLength(1);
      expect(next.ingredients[0]._id).toBe('filling-1');
      expect(typeof next.ingredients[0].id).toBe('string');
    });

    it('должен обрабатывать removeIngredient', () => {
      const prev = burgerConstructorReducer(undefined, {
        type: 'UNKNOWN'
      } as AnyAction);

      const withIngredient = burgerConstructorReducer(
        prev,
        addIngredient(filling as any)
      );
      const idToRemove = withIngredient.ingredients[0].id;

      const next = burgerConstructorReducer(
        withIngredient,
        removeIngredient(idToRemove)
      );

      expect(next.ingredients).toHaveLength(0);
    });

    it('должен обрабатывать clearConstructor', () => {
      const prev = burgerConstructorReducer(undefined, {
        type: 'UNKNOWN'
      } as AnyAction);

      const withBunAndFilling = burgerConstructorReducer(
        burgerConstructorReducer(prev, addIngredient(bun as any)),
        addIngredient(filling as any)
      );

      const next = burgerConstructorReducer(
        withBunAndFilling,
        clearConstructor()
      );

      expect(next.bun).toBeNull();
      expect(next.ingredients).toHaveLength(0);
    });

    it('должен обрабатывать moveIngredient', () => {
      const prev = burgerConstructorReducer(undefined, {
        type: 'UNKNOWN'
      } as AnyAction);
      const state1 = burgerConstructorReducer(
        prev,
        addIngredient(filling as any)
      );

      const other = { ...filling, _id: 'filling-2', price: 80 };
      const state2 = burgerConstructorReducer(
        state1,
        addIngredient(other as any)
      );

      const first = state2.ingredients[0];
      const second = state2.ingredients[1];

      const next = burgerConstructorReducer(
        state2,
        moveIngredient({ from: 0, to: 1 })
      );

      expect(next.ingredients[0].id).toBe(second.id);
      expect(next.ingredients[1].id).toBe(first.id);
    });
  });
});

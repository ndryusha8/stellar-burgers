import { FC, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import type { RootState } from '../../services/store';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { createOrder, clearOrderNumber } from '../../services/store';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();

  const constructorItems = useSelector(
    (state: RootState) => state.burgerConstructor
  );
  const { isLoading: orderRequest, orderNumber } = useSelector(
    (state: RootState) => state.orderRequest
  );

  // Приводим номер заказа к типу TOrder (минимально необходимая структура)
  const orderModalData = orderNumber
    ? {
        _id: String(orderNumber),
        status: 'done',
        name: 'Заказ оформлен',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        number: orderNumber,
        ingredients: []
      }
    : null;

  const onOrderClick = useCallback(() => {
    if (!constructorItems.bun || orderRequest) return;

    const ingredientsIds: string[] = [];

    if (constructorItems.bun) {
      ingredientsIds.push(constructorItems.bun._id);
      ingredientsIds.push(constructorItems.bun._id);
    }

    constructorItems.ingredients.forEach(
      (ingredient: TConstructorIngredient) => {
        ingredientsIds.push(ingredient._id);
      }
    );

    dispatch(createOrder(ingredientsIds));
  }, [constructorItems, orderRequest, dispatch]);

  const closeOrderModal = useCallback(() => {
    dispatch(clearOrderNumber());
  }, [dispatch]);

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};

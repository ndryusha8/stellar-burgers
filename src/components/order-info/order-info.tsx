import { FC, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';

import { useSelector } from '../../services/store';
import type { RootState } from '../../services/store';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();

  const feedOrders = useSelector(
    (state: RootState) => state.feeds.orders
  ) as TOrder[];

  const profileOrders = useSelector(
    (state: RootState) => state.orders.orders
  ) as TOrder[];

  const ingredients = useSelector(
    (state: RootState) => state.ingredients.ingredients
  ) as TIngredient[];

  const orderData = useMemo(() => {
    if (!number) return null;
    const orderNumber = Number(number);
    if (!Number.isFinite(orderNumber)) return null;

    return (
      feedOrders.find((o) => o.number === orderNumber) ??
      profileOrders.find((o) => o.number === orderNumber) ??
      null
    );
  }, [feedOrders, profileOrders, number]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [ingredients, orderData]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};

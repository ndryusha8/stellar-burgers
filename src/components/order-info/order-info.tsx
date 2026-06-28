import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { NotFound404 } from '@pages';

import { useDispatch, useSelector } from '../../services/store';
import type { RootState } from '../../services/store';
import { getOrderByNumber, selectIngredients } from '../../services/store';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();

  const feedOrders = useSelector(
    (state: RootState) => state.feeds.orders
  ) as TOrder[];

  const profileOrders = useSelector(
    (state: RootState) => state.orders.orders
  ) as TOrder[];

  const ingredients = useSelector(selectIngredients);
  const ingredientsStatus = useSelector(
    (state: RootState) => state.ingredients.status
  );

  const orderStatus = useSelector((state: RootState) => state.orders.status);

  const orderData = useMemo(() => {
    if (!number) return null;
    const orderNumber = Number(number);
    if (!Number.isFinite(orderNumber)) return null;

    const fromFeed = feedOrders?.find((o) => o?.number === orderNumber);
    if (fromFeed) return fromFeed;

    const fromProfile = profileOrders?.find((o) => o?.number === orderNumber);
    if (fromProfile) return fromProfile;

    return null;
  }, [feedOrders, profileOrders, number]);

  useEffect(() => {
    if (!orderData && number) {
      const orderNumber = Number(number);
      if (Number.isFinite(orderNumber)) {
        dispatch(getOrderByNumber(orderNumber));
      }
    }
  }, [dispatch, orderData, number]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients?.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo =
      orderData.ingredients?.reduce((acc: TIngredientsWithCount, item) => {
        if (!item) return acc;

        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing?._id === item);
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
      }, {}) || {};

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + (item?.price || 0) * (item?.count || 0),
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [ingredients, orderData]);

  const isIngredientsLoading =
    ingredientsStatus === 'loading' && !ingredients.length;
  const isOrderLoading = orderStatus === 'loading' && !orderData;

  if (isIngredientsLoading || isOrderLoading) {
    return <Preloader />;
  }

  if (!orderData && !isOrderLoading) {
    return <NotFound404 />;
  }

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};

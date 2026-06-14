import { Preloader } from '@ui';
import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';

import {
  fetchProfileOrders,
  useDispatch,
  useSelector
} from '../../services/store';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  const orders = useSelector((state) => state.orders.orders) as TOrder[];
  const status = useSelector((state) => state.orders.status) as string;

  useEffect(() => {
    dispatch(fetchProfileOrders());
  }, [dispatch]);

  if (status === 'loading') {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};

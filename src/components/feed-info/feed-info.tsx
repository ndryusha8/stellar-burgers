import { FC, useMemo } from 'react';

import { TOrder, TOrdersData } from '@utils-types';
import { useSelector } from '../../services/store';
import { FeedInfoUI } from '../ui/feed-info';
import { Preloader } from '@ui';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const status = useSelector((state) => state.feeds.status);
  const error = useSelector((state) => state.feeds.error);
  const orders = useSelector((state) => state.feeds.orders) as TOrder[];
  const total = useSelector((state) => state.feeds.total) as number;
  const totalToday = useSelector((state) => state.feeds.totalToday) as number;

  const feed = useMemo<TOrdersData>(
    () => ({
      orders,
      total,
      totalToday
    }),
    [orders, total, totalToday]
  );

  const readyOrders = useMemo(() => getOrders(orders, 'done'), [orders]);
  const pendingOrders = useMemo(() => getOrders(orders, 'pending'), [orders]);

  if (status === 'loading') {
    return <Preloader />;
  }

  if (error) {
    return (
      <div
        style={{
          padding: '40px',
          textAlign: 'center',
          color: 'var(--colors-interface-error)'
        }}
      >
        <p className='text text_type_main-medium'>Ошибка загрузки данных</p>
        <p className='text text_type_main-default text_color_inactive mt-2'>
          {error}
        </p>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div
        style={{
          padding: '40px',
          textAlign: 'center',
          color: 'var(--colors-interface-text-secondary)'
        }}
      >
        <p className='text text_type_main-medium'>Нет доступных заказов</p>
      </div>
    );
  }

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};

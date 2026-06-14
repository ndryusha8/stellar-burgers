import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';

import { fetchFeeds, useDispatch, useSelector } from '../../services/store';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  const orders = useSelector((state) => state.feeds.orders) as TOrder[];
  const status = useSelector((state) => state.feeds.status) as string;

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  if (status === 'loading') {
    return <Preloader />;
  }

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeeds())} />
  );
};

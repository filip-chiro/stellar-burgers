import { FC, useMemo } from 'react';
import { useSelector } from '../../services/store';
import { feedSelectors } from '../../services/slices/feed';

import { FeedInfoUI } from '../ui/feed-info';
import { TOrder } from '@utils-types';

export const FeedInfo: FC = () => {
  const orders: TOrder[] = useSelector(feedSelectors.getFeedOrders);
  const feed = useSelector(feedSelectors.getFeed);

  const { readyOrders, pendingOrders } = useMemo(() => {
    const filterOrders = (status: string) =>
      orders
        .filter((item) => item.status === status)
        .map((item) => item.number)
        .slice(0, 20);

    return {
      readyOrders: filterOrders('done'),
      pendingOrders: filterOrders('pending')
    };
  }, [orders]);

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};

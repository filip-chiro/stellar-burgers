import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { OrderCardProps } from './type';
import { TIngredient, TOrder } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';
import { useSelector } from '../../services/store';
import { ingredientsSelectors } from '../../services/slices/ingredients';

const MAX_INGREDIENTS = 6;

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation();
  const ingredients = useSelector(ingredientsSelectors.getIngredients);

  const orderInfo = useMemo(() => {
    if (!ingredients.length) return null;

    const ingredientsInfo: TIngredient[] = order.ingredients
      .map((id) => ingredients.find((ing) => ing._id === id))
      .filter((ing): ing is TIngredient => Boolean(ing));

    if (!ingredientsInfo.length) return null;

    const total = ingredientsInfo.reduce((sum, ing) => sum + ing.price, 0);
    const ingredientsToShow = ingredientsInfo.slice(0, MAX_INGREDIENTS);
    const remains =
      ingredientsInfo.length > MAX_INGREDIENTS
        ? ingredientsInfo.length - MAX_INGREDIENTS
        : 0;

    return {
      ...order,
      ingredientsInfo,
      ingredientsToShow,
      remains,
      total,
      date: new Date(order.createdAt)
    };
  }, [order, ingredients]);

  if (!orderInfo) return null;

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={MAX_INGREDIENTS}
      locationState={{ background: location }}
    />
  );
});

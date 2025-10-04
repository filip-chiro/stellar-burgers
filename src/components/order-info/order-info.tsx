import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';

import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { orderSelectors } from '../../services/slices/order';
import { ingredientsSelectors } from '../../services/slices/ingredients';
import { getOrderByNumberThunk } from '../../services/thunk/order';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();

  const orderData: TOrder | null = useSelector(orderSelectors.getOrderByNumber);
  const ingredients: TIngredient[] = useSelector(
    ingredientsSelectors.getIngredients
  );

  useEffect(() => {
    if (number) dispatch(getOrderByNumberThunk(Number(number)));
  }, [dispatch, number]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const ingredientsInfo = orderData.ingredients.reduce<
      Record<string, TIngredient & { count: number }>
    >((acc, id) => {
      const ingredient = ingredients.find((ing) => ing._id === id);
      if (!ingredient) return acc;

      if (acc[id]) {
        acc[id].count++;
      } else {
        acc[id] = { ...ingredient, count: 1 };
      }
      return acc;
    }, {});

    const total = Object.values(ingredientsInfo).reduce(
      (sum, item) => sum + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      total,
      date: new Date(orderData.createdAt)
    };
  }, [orderData, ingredients]);

  if (!orderInfo) return <Preloader />;

  return <OrderInfoUI orderInfo={orderInfo} />;
};

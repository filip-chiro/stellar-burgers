import { FC, useMemo } from 'react';
import { BurgerConstructorUI } from '@ui';
import { useAppSelector, useAppDispatch } from '../../services/store';
import { TIngredient } from '@utils-types';
import { useNavigate } from 'react-router-dom';
import {
  selectIsAuthenticated,
  selectOrderRequest,
  selectConstructorItems,
  selectOrderModalData,
  fetchNewOrder,
  closeOrderRequest
} from '../../services/slices/stellarBurgerSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const orderRequest = useAppSelector(selectOrderRequest);
  const constructorItems = useAppSelector(selectConstructorItems);
  const orderModalData = useAppSelector(selectOrderModalData);

  const onOrderClick = () => {
    if (!isAuthenticated) {
      return navigate('/login', { replace: true });
    }

    if (constructorItems.bun._id && constructorItems.ingredients.length) {
      const ingredientsIds = constructorItems.ingredients.map(
        (item: { _id: any }) => item._id
      );
      dispatch(
        fetchNewOrder([
          constructorItems.bun._id,
          ...ingredientsIds,
          constructorItems.bun._id
        ])
      );
    }
  };
  const closeOrderModal = () => {
    dispatch(closeOrderRequest());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price! * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TIngredient) => s + v.price,
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

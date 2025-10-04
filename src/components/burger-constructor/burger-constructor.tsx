import { FC, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { constructorSelectors } from '../../services/slices/constructor';
import { sendOrderThunk } from '../../services/thunk/order';
import { orderActions } from '../../services/slices/order';
import { getCookie } from '../../utils/cookie';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { bun, ingredients } = useSelector(constructorSelectors.getConstructor);
  const { isLoading, orderModalData } = useSelector((state) => state.order);

  const constructorItems = {
    bun: bun ?? null,
    ingredients: ingredients ?? []
  };

  const totalPrice = useMemo(() => {
    const bunPrice = constructorItems.bun ? constructorItems.bun.price * 2 : 0;
    const ingredientsPrice = constructorItems.ingredients.reduce(
      (sum: number, item: TConstructorIngredient) => sum + item.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [constructorItems]);

  const handleOrder = useCallback(() => {
    if (!constructorItems.bun || isLoading) return;

    const token = getCookie('accessToken');
    if (!token) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    const orderIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((el) => el._id),
      constructorItems.bun._id
    ];

    dispatch(sendOrderThunk(orderIds));
  }, [constructorItems, isLoading, navigate, location, dispatch]);

  const handleCloseModal = useCallback(() => {
    dispatch(orderActions.resetOrder());
  }, [dispatch]);

  return (
    <BurgerConstructorUI
      price={totalPrice}
      orderRequest={isLoading}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={handleOrder}
      closeOrderModal={handleCloseModal}
    />
  );
};

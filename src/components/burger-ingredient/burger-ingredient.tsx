import { FC, memo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { constructorActions } from '../../services/slices/constructor';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const dispatch = useDispatch();
    const location = useLocation();

    const onAdd = useCallback(() => {
      dispatch(constructorActions.addIngredient(ingredient));
    }, [dispatch, ingredient]);

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={onAdd}
      />
    );
  }
);

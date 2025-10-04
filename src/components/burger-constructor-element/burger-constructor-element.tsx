import { FC, memo, useCallback } from 'react';
import { useDispatch } from '../../services/store';
import { constructorActions } from '../../services/slices/constructor';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    const moveIngredient = useCallback(
      (toIndex: number) => {
        dispatch(
          constructorActions.moveIngredient({ fromIndex: index, toIndex })
        );
      },
      [dispatch, index]
    );

    const onMoveUp = useCallback(() => {
      if (index > 0) moveIngredient(index - 1);
    }, [index, moveIngredient]);

    const onMoveDown = useCallback(() => {
      if (index < totalItems - 1) moveIngredient(index + 1);
    }, [index, totalItems, moveIngredient]);

    const onRemove = useCallback(() => {
      dispatch(constructorActions.removeIngredient(ingredient.id));
    }, [dispatch, ingredient.id]);

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={onMoveUp}
        handleMoveDown={onMoveDown}
        handleClose={onRemove}
      />
    );
  }
);

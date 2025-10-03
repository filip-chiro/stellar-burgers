import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useAppDispatch } from '../../services/store';
import {
  moveIngredientDown,
  moveIngredientUp,
  deleteIngredient
} from '../../services/slices/stellarBurgerSlice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }: any) => {
    const dispatch = useAppDispatch();

    const handleMoveDown = () => {
      dispatch(moveIngredientDown(ingredient));
    };

    const handleMoveUp = () => {
      dispatch(moveIngredientUp(ingredient));
    };

    const handleClose = () => {
      dispatch(deleteIngredient(ingredient));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);

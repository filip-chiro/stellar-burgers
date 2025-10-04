import { forwardRef, useMemo } from 'react';
import { useSelector } from '../../services/store';
import { constructorSelectors } from '../../services/slices/constructor';

import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const { bun, ingredients: constructorIngredients } = useSelector(
    constructorSelectors.getConstructor
  );

  const counters = useMemo(() => {
    const map: Record<string, number> = {};

    constructorIngredients.forEach((item: TIngredient) => {
      map[item._id] = (map[item._id] ?? 0) + 1;
    });

    if (bun) {
      map[bun._id] = 2;
    }

    return map;
  }, [bun, constructorIngredients]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={counters}
      ref={ref}
    />
  );
});

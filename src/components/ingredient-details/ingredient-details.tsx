import { FC } from 'react';
import { useParams } from 'react-router-dom';

import { useSelector } from '../../services/store';
import type { RootState } from '../../services/store';

import { Preloader } from '@ui';
import { IngredientDetailsUI } from '@ui';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();

  const ingredients = useSelector(
    (state: RootState) => state.ingredients.ingredients
  );

  const ingredientData = ingredients.find(
    (ingredient) => ingredient._id === id
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};

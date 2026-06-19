import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import type { RootState } from '../../services/store';
import { Preloader } from '@ui';
import { IngredientDetailsUI } from '@ui';
import { NotFound404 } from '@pages';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();

  const ingredients = useSelector(
    (state: RootState) => state.ingredients.ingredients
  );

  const ingredientsStatus = useSelector(
    (state: RootState) => state.ingredients.status
  );

  if (ingredientsStatus === 'loading' && !ingredients.length) {
    return <Preloader />;
  }

  const ingredientData = ingredients.find(
    (ingredient) => ingredient._id === id
  );

  if (!ingredientData) {
    return <NotFound404 />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};

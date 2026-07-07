import { Preloader } from '@ui';
import styles from './constructor-page.module.css';

import { BurgerIngredients } from '@components';
import { BurgerConstructor } from '@components';
import { FC } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { useSelector } from '../../services/store';
import { selectIngredientsStatus } from '../../services/store';

export const ConstructorPage: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const status = useSelector(selectIngredientsStatus);

  if (status === 'loading') {
    return (
      <main className={styles.containerMain}>
        <Preloader />
      </main>
    );
  }

  return (
    <main className={styles.containerMain}>
      <h1
        className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
      >
        Соберите бургер
      </h1>
      <div className={`${styles.main} pl-5 pr-5`}>
        <BurgerIngredients />
        <BurgerConstructor />
      </div>
    </main>
  );
};

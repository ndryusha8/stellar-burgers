import { useEffect } from 'react';
import { useDispatch } from '../../services/store';
import { fetchIngredients, fetchUser } from '../../services/store';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader } from '@components';
import { AppRoutes } from './routes';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(fetchUser());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <AppRoutes />
    </div>
  );
};

export default App;

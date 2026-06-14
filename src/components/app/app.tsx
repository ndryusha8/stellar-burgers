import '../../index.css';
import styles from './app.module.css';

import { AppHeader } from '@components';
import { AppRoutes } from './routes';

const App = () => (
  <div className={styles.app}>
    <AppHeader />
    <AppRoutes />
  </div>
);

export default App;

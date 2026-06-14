import { Routes, Route } from 'react-router-dom';

import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import { Modal } from '../modal';
import { OrderInfo } from '@components';
import { IngredientDetails } from '@components';
import { ProtectedRoute } from '@components';

export const AppRoutes = () => (
  <Routes>
    <Route path='/' element={<ConstructorPage />} />
    <Route path='/feed' element={<Feed />} />
    <Route path='/login' element={<Login />} />
    <Route path='/register' element={<Register />} />
    <Route
      path='/forgot-password'
      element={
        <ProtectedRoute>
          <ForgotPassword />
        </ProtectedRoute>
      }
    />
    <Route
      path='/reset-password'
      element={
        <ProtectedRoute>
          <ResetPassword />
        </ProtectedRoute>
      }
    />
    <Route
      path='/profile'
      element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      }
    />
    <Route
      path='/profile/orders'
      element={
        <ProtectedRoute>
          <ProfileOrders />
        </ProtectedRoute>
      }
    />

    <Route
      path='/feed/:number'
      element={
        <Modal title='Информация о заказе' onClose={() => {}}>
          <OrderInfo />
        </Modal>
      }
    />
    <Route
      path='/ingredients/:id'
      element={
        <Modal title='Детали ингредиента' onClose={() => {}}>
          <IngredientDetails />
        </Modal>
      }
    />
    <Route
      path='/profile/orders/:number'
      element={
        <ProtectedRoute>
          <Modal title='Информация о заказе' onClose={() => {}}>
            <OrderInfo />
          </Modal>
        </ProtectedRoute>
      }
    />

    <Route path='*' element={<NotFound404 />} />
  </Routes>
);

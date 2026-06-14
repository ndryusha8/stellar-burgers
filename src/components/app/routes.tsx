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
import { OrderInfo } from '../order-info';
import { IngredientDetails } from '../ingredient-details';
import { ProtectedRoute } from '../protected-route';

export const AppRoutes = () => (
  <Routes>
    <Route path='/' element={<ConstructorPage />} />
    <Route path='/feed' element={<Feed />} />

    <Route
      path='/login'
      element={
        <ProtectedRoute>
          <Login />
        </ProtectedRoute>
      }
    />
    <Route
      path='/register'
      element={
        <ProtectedRoute>
          <Register />
        </ProtectedRoute>
      }
    />
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

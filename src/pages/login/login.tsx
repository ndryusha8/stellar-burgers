import { FC, SyntheticEvent, useState } from 'react';

import { LoginUI } from '@ui-pages';
import { login, useDispatch } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { setCookie } from '../../../src/utils/cookie';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState<string | undefined>(undefined);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    setErrorText(undefined);

    dispatch(login({ email, password }))
      .unwrap()
      .then(() => {
        navigate('/');
      })
      .catch((err: unknown) => {
        const message = (err as { message?: string })?.message;
        setErrorText(message || 'Ошибка авторизации');
      });
  };

  return (
    <LoginUI
      errorText={errorText}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};

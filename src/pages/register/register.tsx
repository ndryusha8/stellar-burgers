import { FC, SyntheticEvent, useState } from 'react';

import { RegisterUI } from '@ui-pages';
import { register, useDispatch } from '../../services/store';
import { useNavigate } from 'react-router-dom';

export const Register: FC = () => {
  const dispatch = useDispatch();

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState<string | undefined>(undefined);

  const handleSubmit = (e: SyntheticEvent) => {
    const navigate = useNavigate();
    e.preventDefault();

    setErrorText(undefined);

    dispatch(register({ email, name: userName, password }))
      .unwrap()
      .then(() => navigate('/'))
      .catch((err: unknown) => {
        const message = (err as { message?: string })?.message;
        setErrorText(message || 'Ошибка регистрации');
      });
  };

  return (
    <RegisterUI
      errorText={errorText}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};

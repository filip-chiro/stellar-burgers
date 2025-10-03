import { FC, SyntheticEvent, useEffect } from 'react';
import { LoginUI } from '@ui-pages';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { useForm } from '../../hooks/useForm';
import {
  selectErrorText,
  removeErrorText,
  fetchLoginUser,
  selectLoading
} from '../../services/slices/stellarBurgerSlice';
import { Preloader } from '@ui';
import { setCookie } from '../../utils/cookie';

export const Login: FC = () => {
  const dispatch = useAppDispatch();
  const { values, handleChange } = useForm({
    email: '',
    password: ''
  });
  const error = useAppSelector(selectErrorText);
  const isLoading = useAppSelector(selectLoading);

  useEffect(() => {
    dispatch(removeErrorText());
  }, []);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(removeErrorText());
    dispatch(fetchLoginUser(values))
      .unwrap()
      .then((payload) => {
        setCookie('accessToken', payload.accessToken);
        localStorage.setItem('refreshToken', payload.refreshToken);
      });
  };

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <LoginUI
      errorText={error}
      email={values.email}
      setEmail={(val) => {
        const value = typeof val === 'string' ? val : val(values.email);
        handleChange({
          target: { name: 'email', value }
        } as React.ChangeEvent<HTMLInputElement>);
      }}
      password={values.password}
      setPassword={(val) => {
        const value = typeof val === 'string' ? val : val(values.password);
        handleChange({
          target: { name: 'password', value }
        } as React.ChangeEvent<HTMLInputElement>);
      }}
      handleSubmit={handleSubmit}
    />
  );
};

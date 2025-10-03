import { FC, useState, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../../hooks/useForm';

import { forgotPasswordApi } from '@api';
import { ForgotPasswordUI } from '@ui-pages';

export const ForgotPassword: FC = () => {
  const { values, handleChange } = useForm({ email: '' });
  const [error, setError] = useState<Error | null>(null);

  const navigate = useNavigate();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    setError(null);
    forgotPasswordApi(values)
      .then(() => {
        localStorage.setItem('resetPassword', 'true');
        navigate('/reset-password', { replace: true });
      })
      .catch((err) => setError(err));
  };

  return (
    <ForgotPasswordUI
      errorText={error?.message}
      email={values.email}
      setEmail={(val) => {
        if (typeof val === 'string') {
          handleChange({
            target: { name: 'email', value: val }
          } as React.ChangeEvent<HTMLInputElement>);
        } else {
          const nextValue = val(values.email);
          handleChange({
            target: { name: 'email', value: nextValue }
          } as React.ChangeEvent<HTMLInputElement>);
        }
      }}
      handleSubmit={handleSubmit}
    />
  );
};

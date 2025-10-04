import { FC, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { logoutThunk } from '../../services/thunk/user';
import { ProfileMenuUI } from '@ui';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const handleLogout = useCallback(() => {
    dispatch(logoutThunk());
  }, [dispatch]);

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};

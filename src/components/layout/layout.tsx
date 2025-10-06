import { FC, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { AppHeader } from '@components';

import { useDispatch } from '../../services/store';
import { userActions } from '../../services/slices/user';
import { getIngredientsThunk } from '../../services/thunk/ingredients';
import { getUserThunk } from '../../services/thunk/user';
import { getCookie } from '../../utils/cookie';

export const Layout: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initApp = async () => {
      dispatch(getIngredientsThunk());

      if (getCookie('accessToken')) {
        dispatch(getUserThunk());
      }

      dispatch(userActions.authCheck());
    };

    initApp();
  }, [dispatch]);

  return (
    <div className='app-layout'>
      <AppHeader />
      <Outlet />
    </div>
  );
};

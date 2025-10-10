import { userSlice, userActions, UserState } from './user';
import {
  registerUserThunk,
  loginUserThunk,
  getUserThunk,
  logoutThunk,
  getUserOrdersThunk,
  updateUserThunk
} from '../thunk/user';
import { TOrder } from '@utils-types';

describe('userSlice', () => {
  const initialState: UserState = userSlice.getInitialState();
  const pendingState: UserState = { ...initialState, isLoading: true };
  const rejectedState = {
    ...initialState,
    error: 'Тестовая ошибка',
    isLoading: false
  };
  const errorMessage = 'Тестовая ошибка';
  const userData = { name: 'Test', email: 'test@test.com' };
  const stateWithUser: UserState = {
    ...initialState,
    userData: userData,
    isLoading: false
  };
  const pendingStateWithUser: UserState = {
    ...initialState,
    userData: userData,
    isLoading: true
  };
  const ordersMock: TOrder[] = [
    {
      _id: 'idtest1',
      status: 'done',
      name: 'test1',
      createdAt: '2025-10-10T11:38:11.245Z',
      updatedAt: '2025-09-10T11:38:12.326Z',
      number: 123,
      ingredients: ['1', '1']
    },
    {
      _id: 'idtest2',
      status: 'done',
      name: 'test2',
      createdAt: '2025-10-10T11:38:11.245Z',
      updatedAt: '2025-10-10T11:38:12.326Z',
      number: 124,
      ingredients: ['3', '4', '3']
    }
  ];

  it('должен вернуть корректное начальное состояние', () => {
    expect(initialState).toEqual({
      isAuthChecked: false,
      userData: null,
      userOrders: [],
      isLoading: false,
      error: null
    });
  });

  describe('authCheck', () => {
    it('должен установить isAuthChecked в true', () => {
      const state = userSlice.reducer(initialState, userActions.authCheck());

      expect(state.isAuthChecked).toBe(true);
      expect(state.userData).toEqual(initialState.userData);
      expect(state.userOrders).toEqual(initialState.userOrders);
      expect(state.isLoading).toEqual(initialState.isLoading);
      expect(state.error).toEqual(initialState.error);
    });
  });

  describe('registerUserThunk', () => {
    it('должен установить состояние загрузки при pending', () => {
      const state = userSlice.reducer(rejectedState, {
        type: registerUserThunk.pending.type
      });

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    describe('rejected', () => {
      it('должен установить ошибку когда action.error.message не пустой', () => {
        const state = userSlice.reducer(pendingState, {
          type: registerUserThunk.rejected.type,
          error: { message: errorMessage }
        });

        expect(state.isLoading).toBe(false);
        expect(state.error).toBe(errorMessage);
      });

      it('должен установить ошибку по умолчанию когда action.error.message пустой', () => {
        const state = userSlice.reducer(pendingState, {
          type: registerUserThunk.rejected.type,
          error: {}
        });

        expect(state.isLoading).toBe(false);
        expect(state.error).toBe('Произошла ошибка');
      });
    });

    it('должен обработать успешную регистрацию пользователя', () => {
      const state = userSlice.reducer(pendingState, {
        type: registerUserThunk.fulfilled.type,
        payload: userData
      });

      expect(state.isLoading).toBe(false);
      expect(state.userData).toEqual(userData);
      expect(state.error).toBeNull();
    });
  });

  describe('loginUserThunk', () => {
    it('должен установить состояние загрузки при pending', () => {
      const state = userSlice.reducer(initialState, {
        type: loginUserThunk.pending.type
      });

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    describe('rejected', () => {
      it('должен установить ошибку когда action.error.message не пустой', () => {
        const state = userSlice.reducer(pendingState, {
          type: loginUserThunk.rejected.type,
          error: { message: errorMessage }
        });

        expect(state.isLoading).toBe(false);
        expect(state.error).toBe(errorMessage);
      });

      it('должен установить ошибку по умолчанию когда action.error.message пустой', () => {
        const state = userSlice.reducer(pendingState, {
          type: loginUserThunk.rejected.type,
          error: {}
        });

        expect(state.isLoading).toBe(false);
        expect(state.error).toBe('Произошла ошибка');
      });
    });

    it('должен обработать успешный вход пользователя', () => {
      const state = userSlice.reducer(pendingState, {
        type: loginUserThunk.fulfilled.type,
        payload: userData
      });

      expect(state.isLoading).toBe(false);
      expect(state.userData).toEqual(userData);
      expect(state.error).toBeNull();
    });
  });

  describe('getUserThunk', () => {
    it('должен установить состояние загрузки при pending', () => {
      const state = userSlice.reducer(initialState, {
        type: getUserThunk.pending.type
      });

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    describe('rejected', () => {
      it('должен установить ошибку когда action.error.message не пустой', () => {
        const state = userSlice.reducer(pendingState, {
          type: getUserThunk.rejected.type,
          error: { message: errorMessage }
        });

        expect(state.isLoading).toBe(false);
        expect(state.error).toBe(errorMessage);
      });

      it('должен установить ошибку по умолчанию когда action.error.message пустой', () => {
        const state = userSlice.reducer(pendingState, {
          type: getUserThunk.rejected.type,
          error: {}
        });

        expect(state.isLoading).toBe(false);
        expect(state.error).toBe('Произошла ошибка');
      });
    });

    it('должен обработать успешное получение данных пользователя', () => {
      const state = userSlice.reducer(pendingState, {
        type: getUserThunk.fulfilled.type,
        payload: { success: true, user: userData }
      });

      expect(state.isLoading).toBe(false);
      expect(state.userData).toEqual(userData);
      expect(state.error).toBeNull();
    });
  });

  describe('logoutThunk', () => {
    it('должен установить состояние загрузки при pending', () => {
      const state = userSlice.reducer(stateWithUser, {
        type: logoutThunk.pending.type
      });

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.userData).toEqual(userData);
      expect(state.userOrders).toEqual(stateWithUser.userOrders);
    });

    describe('rejected', () => {
      it('должен установить ошибку когда action.error.message не пустой', () => {
        const state = userSlice.reducer(pendingStateWithUser, {
          type: logoutThunk.rejected.type,
          error: { message: errorMessage }
        });

        expect(state.isLoading).toBe(false);
        expect(state.error).toBe(errorMessage);
        expect(state.userData).toEqual(userData);
        expect(state.userOrders).toEqual(pendingStateWithUser.userOrders);
      });

      it('должен установить ошибку по умолчанию когда action.error.message пустой', () => {
        const state = userSlice.reducer(pendingStateWithUser, {
          type: logoutThunk.rejected.type,
          error: {}
        });

        expect(state.isLoading).toBe(false);
        expect(state.error).toBe('Произошла ошибка');
        expect(state.userData).toEqual(userData);
        expect(state.userOrders).toEqual(pendingStateWithUser.userOrders);
      });
    });

    it('должен очистить данные пользователя при успешном выходе', () => {
      const state = userSlice.reducer(pendingStateWithUser, {
        type: logoutThunk.fulfilled.type
      });

      expect(state.isLoading).toBe(false);
      expect(state.userData).toBeNull();
      expect(state.userOrders).toEqual([]);
      expect(state.error).toBeNull();
    });
  });

  describe('getUserOrdersThunk', () => {
    it('должен установить состояние загрузки при pending', () => {
      const state = userSlice.reducer(stateWithUser, {
        type: getUserOrdersThunk.pending.type
      });

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    describe('rejected', () => {
      it('должен установить ошибку когда action.error.message не пустой', () => {
        const state = userSlice.reducer(pendingStateWithUser, {
          type: getUserOrdersThunk.rejected.type,
          error: { message: errorMessage }
        });

        expect(state.isLoading).toBe(false);
        expect(state.error).toBe(errorMessage);
      });

      it('должен установить ошибку по умолчанию когда action.error.message пустой', () => {
        const state = userSlice.reducer(pendingStateWithUser, {
          type: getUserOrdersThunk.rejected.type,
          error: {}
        });

        expect(state.isLoading).toBe(false);
        expect(state.error).toBe('Произошла ошибка');
      });
    });

    it('должен обработать успешное получение заказов пользователя', () => {
      const state = userSlice.reducer(pendingStateWithUser, {
        type: getUserOrdersThunk.fulfilled.type,
        payload: ordersMock
      });

      expect(state.isLoading).toBe(false);
      expect(state.userOrders).toEqual(ordersMock);
      expect(state.error).toBeNull();
    });
  });

  describe('updateUserThunk', () => {
    it('должен установить состояние загрузки при pending', () => {
      const state = userSlice.reducer(initialState, {
        type: updateUserThunk.pending.type
      });

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    describe('rejected', () => {
      it('должен установить ошибку когда action.error.message не пустой', () => {
        const state = userSlice.reducer(pendingStateWithUser, {
          type: updateUserThunk.rejected.type,
          error: { message: errorMessage }
        });

        expect(state.isLoading).toBe(false);
        expect(state.error).toBe(errorMessage);
      });

      it('должен установить ошибку по умолчанию когда action.error.message пустой', () => {
        const state = userSlice.reducer(pendingStateWithUser, {
          type: updateUserThunk.rejected.type,
          error: {}
        });

        expect(state.isLoading).toBe(false);
        expect(state.error).toBe('Произошла ошибка');
      });
    });

    it('должен обработать успешное обновление данных пользователя', () => {
      const newUserData = { name: 'New Name', email: 'new@test.com' };
      const state = userSlice.reducer(pendingStateWithUser, {
        type: updateUserThunk.fulfilled.type,
        payload: newUserData
      });

      expect(state.isLoading).toBe(false);
      expect(state.userData).toEqual(newUserData);
      expect(state.error).toBeNull();
    });
  });

  describe('selectors', () => {
    const mockState: UserState = {
      isAuthChecked: true,
      userData: userData,
      userOrders: ordersMock,
      isLoading: false,
      error: null
    };

    it('getUserData должен вернуть данные пользователя', () => {
      const result = userSlice.selectors.getUserData({ user: mockState });
      expect(result).toEqual(mockState.userData);
    });

    it('getUserOrders должен вернуть заказы пользователя', () => {
      const result = userSlice.selectors.getUserOrders({ user: mockState });
      expect(result).toEqual(mockState.userOrders);
    });

    it('getIsAuthChecked должен вернуть статус проверки аутентификации', () => {
      const result = userSlice.selectors.getIsAuthChecked({ user: mockState });
      expect(result).toEqual(mockState.isAuthChecked);
    });

    it('getIsLoading должен вернуть статус загрузки', () => {
      const result = userSlice.selectors.getIsLoading({ user: mockState });
      expect(result).toEqual(mockState.isLoading);
    });
  });
});

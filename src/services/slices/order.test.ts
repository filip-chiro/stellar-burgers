import { orderSlice, orderActions, orderState } from './order';
import { getOrderByNumberThunk, sendOrderThunk } from '../thunk/order';
import { TOrder } from '@utils-types';

describe('orderSlice', () => {
  afterAll(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  const initialState = orderSlice.getInitialState();
  const mockState: orderState = {
    orderData: {
      _id: 'test',
      status: 'done',
      name: 'test',
      createdAt: '2025-10-10T11:38:11.245Z',
      updatedAt: '2025-10-10T11:38:12.326Z',
      number: 123,
      ingredients: ['1', '1']
    },
    orderModalData: {
      _id: 'test',
      status: 'done',
      name: 'test',
      createdAt: '2025-10-10T11:38:11.245Z',
      updatedAt: '2025-10-10T11:38:12.326Z',
      number: 123,
      ingredients: ['1', '1']
    },
    orderName: 'test',
    isLoading: false,
    error: null
  };

  const pendingState = {
    ...initialState,
    isLoading: true
  };

  const errorMessage = 'Тестовая ошибка';

  describe('resetOrder', () => {
    it('должен очистить все данные заказа', () => {
      const state = orderSlice.reducer(mockState, orderActions.resetOrder());

      expect(state).toEqual({
        orderData: null,
        orderModalData: null,
        orderName: null,
        isLoading: false,
        error: null
      });
    });
  });

  describe('getOrderByNumberThunk', () => {
    it('должен установить состояние загрузки при pending', () => {
      const stateWithData = {
        ...mockState,
        orderModalData: null,
        error: 'Previous error',
        isLoading: false
      };

      const state = orderSlice.reducer(stateWithData, {
        type: getOrderByNumberThunk.pending.type
      });

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.orderData).toBeNull();
    });

    describe('rejected', () => {
      it('должен установить ошибку когда action.error.message не пустой', () => {
        const state = orderSlice.reducer(pendingState, {
          type: getOrderByNumberThunk.rejected.type,
          error: { message: errorMessage }
        });

        expect(state.isLoading).toBe(false);
        expect(state.error).toBe(errorMessage);
        expect(state.orderData).toBeNull();
      });

      it('должен установить ошибку по умолчанию когда action.error.message пустой', () => {
        const state = orderSlice.reducer(pendingState, {
          type: getOrderByNumberThunk.rejected.type,
          error: {}
        });

        expect(state.isLoading).toBe(false);
        expect(state.error).toBe('Произошла ошибка');
        expect(state.orderData).toBeNull();
      });
    });

    describe('fulfilled', () => {
      it('должен обработать успешную загрузку заказа по номеру', () => {
        const orderData: TOrder = {
          _id: 'test',
          status: 'done',
          name: 'test',
          createdAt: '2025-10-10T11:38:11.245Z',
          updatedAt: '2025-10-10T11:38:12.326Z',
          number: 123,
          ingredients: ['1', '1']
        };

        const state = orderSlice.reducer(pendingState, {
          type: getOrderByNumberThunk.fulfilled.type,
          payload: {
            orders: [orderData]
          }
        });

        expect(state.isLoading).toBe(false);
        expect(state.error).toBeNull();
        expect(state.orderData).toEqual(orderData);
        expect(state.orderModalData).toBeNull();
        expect(state.orderName).toBeNull();
      });
    });
  });

  describe('sendOrderThunk', () => {
    it('должен установить состояние загрузки при pending', () => {
      const stateWithData = {
        ...mockState,
        orderModalData: null,
        error: 'Тестовая ошибка',
        isLoading: false
      };

      const state = orderSlice.reducer(stateWithData, {
        type: sendOrderThunk.pending.type
      });

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.orderModalData).toBeNull();
    });

    describe('rejected', () => {
      it('должен установить ошибку когда action.error.message не пустой', () => {
        const state = orderSlice.reducer(pendingState, {
          type: sendOrderThunk.rejected.type,
          error: { message: errorMessage }
        });

        expect(state.isLoading).toBe(false);
        expect(state.error).toBe(errorMessage);
        expect(state.orderModalData).toBeNull();
      });

      it('должен установить ошибку по умолчанию когда action.error.message пустой', () => {
        const state = orderSlice.reducer(pendingState, {
          type: sendOrderThunk.rejected.type,
          error: {}
        });

        expect(state.isLoading).toBe(false);
        expect(state.error).toBe('Произошла ошибка');
        expect(state.orderModalData).toBeNull();
      });
    });

    it('должен обработать успешную отправку заказа', () => {
      const mockOrderData: TOrder = {
        _id: 'test',
        status: 'done',
        name: 'test',
        createdAt: '2025-10-10T11:38:11.245Z',
        updatedAt: '2025-10-10T11:38:12.326Z',
        number: 123,
        ingredients: ['1', '1']
      };

      const state = orderSlice.reducer(pendingState, {
        type: sendOrderThunk.fulfilled.type,
        payload: { order: mockOrderData, name: 'test' }
      });

      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.orderModalData).toEqual(mockOrderData);
      expect(state.orderName).toBe('test');
    });
  });

  describe('selectors', () => {
    it('getOrderByNumber должен вернуть данные заказа', () => {
      const result = orderSlice.selectors.getOrderByNumber({
        order: mockState
      });

      expect(result).toEqual(mockState.orderData);
    });
  });
});

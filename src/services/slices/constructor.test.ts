import { sendOrderThunk } from '../thunk/order';
import {
  constructorSlice,
  constructorActions,
  constructorState
} from './constructor';
import { TIngredient } from '@utils-types';

describe('constructorSlice', () => {
  afterAll(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  const initialState = constructorSlice.getInitialState();

  const bunKra: TIngredient = {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  };

  const bunFlu: TIngredient = {
    _id: '643d69a5c3f7b9001cfa093d',
    name: 'Флюоресцентная булка R2-D3',
    type: 'bun',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/bun-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png'
  };

  const main: TIngredient = {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  };

  const sauce: TIngredient = {
    _id: '643d69a5c3f7b9001cfa0942',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
  };

  describe('addIngredient', () => {
    it('должен добавить булку в конструктор', () => {
      const state = constructorSlice.reducer(
        initialState,
        constructorActions.addIngredient(bunKra)
      );

      expect(state.bun).toEqual({
        ...bunKra,
        id: expect.any(String)
      });
      expect(state.ingredients).toHaveLength(0);
    });

    it('должен заменить существующую булку на новую', () => {
      let state = constructorSlice.reducer(
        initialState,
        constructorActions.addIngredient(bunKra)
      );

      state = constructorSlice.reducer(
        state,
        constructorActions.addIngredient(bunFlu)
      );

      expect(state.bun).toEqual({
        ...bunFlu,
        id: expect.any(String)
      });
      expect(state.bun).not.toEqual({
        ...bunKra,
        id: expect.any(String)
      });
      expect(state.ingredients).toHaveLength(0);
    });

    it('должен добавить начинку в конструктор', () => {
      const state = constructorSlice.reducer(
        initialState,
        constructorActions.addIngredient(main)
      );

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toEqual({
        ...main,
        id: expect.any(String)
      });
      expect(state.bun).toBeNull();
    });
  });

  describe('removeIngredient', () => {
    it('должен удалить ингредиент по id', () => {
      let state = constructorSlice.reducer(
        initialState,
        constructorActions.addIngredient(main)
      );
      state = constructorSlice.reducer(
        state,
        constructorActions.addIngredient(sauce)
      );

      expect(state.ingredients).toHaveLength(2);

      const ingredientIdToRemove = state.ingredients[0].id;
      state = constructorSlice.reducer(
        state,
        constructorActions.removeIngredient(ingredientIdToRemove)
      );

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]._id).toBe(sauce._id);
    });

    it('не должен удалить ингредиент при неверном id', () => {
      let state = constructorSlice.reducer(
        initialState,
        constructorActions.addIngredient(main)
      );

      state = constructorSlice.reducer(
        state,
        constructorActions.removeIngredient('invalid0id')
      );

      expect(state.ingredients).toHaveLength(1);
    });
  });

  describe('moveIngredient', () => {
    it('должен поменять ингредиенты местами', () => {
      let state = constructorSlice.reducer(
        initialState,
        constructorActions.addIngredient(main)
      );
      state = constructorSlice.reducer(
        state,
        constructorActions.addIngredient(sauce)
      );

      expect(state.ingredients.map((ing) => ing.type)).toEqual([
        'main',
        'sauce'
      ]);

      state = constructorSlice.reducer(
        state,
        constructorActions.moveIngredient({ fromIndex: 0, toIndex: 1 })
      );

      expect(state.ingredients.map((ing) => ing.type)).toEqual([
        'sauce',
        'main'
      ]);
    });
  });

  describe('resetConstructor', () => {
    it('должен сбросить конструктор до начального состояния', () => {
      let state = constructorSlice.reducer(
        initialState,
        constructorActions.addIngredient(main)
      );
      state = constructorSlice.reducer(
        state,
        constructorActions.addIngredient(sauce)
      );
      state = constructorSlice.reducer(
        state,
        constructorActions.addIngredient(bunFlu)
      );

      expect(state.ingredients).toHaveLength(2);
      expect(state.bun).not.toBeNull();

      state = constructorSlice.reducer(
        state,
        constructorActions.resetConstructor()
      );

      expect(state.ingredients).toHaveLength(0);
      expect(state.bun).toBeNull();
    });
  });

  describe('extraReducers: sendOrderThunk.fulfilled', () => {
    it('должен сбросить конструктор при успешной отправке заказа', () => {
      let state = constructorSlice.reducer(
        initialState,
        constructorActions.addIngredient(main)
      );
      state = constructorSlice.reducer(
        state,
        constructorActions.addIngredient(sauce)
      );
      state = constructorSlice.reducer(
        state,
        constructorActions.addIngredient(bunFlu)
      );

      expect(state.bun).not.toBeNull();
      expect(state.ingredients).toHaveLength(2);

      state = constructorSlice.reducer(state, {
        type: sendOrderThunk.fulfilled.type
      });

      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(0);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('selectors', () => {
    const mockState: constructorState = {
      bun: {
        ...bunKra,
        id: 'test'
      },
      ingredients: [],
      isLoading: true,
      error: 'Тестовая ошибка'
    };

    it('getConstructor должен вернуть состояние конструктора', () => {
      const result = constructorSlice.selectors.getConstructor({
        burgerConstructor: mockState
      });

      expect(result).toEqual(mockState);
    });
  });
});

import moxios from 'moxios';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { saveMeal, getMeals, deleteMeal } from '../../src/actions/mealActions';
import * as types from '../../src/actions/actionTypes';
import {
  validMeal,
  saveMealResponse,
  saveMealFailedResponse,
  saveMealFailedResponseB,
  getMealsResponse,
  getMealsFailedResponse,
  deleteMealResponse,
  deleteMealFailedResponse,
  deleteMealFailedResponseB,
} from '../helpers/mockMeals';
import localStorage from '../helpers/mockLocalStorage';
import initialState from '../../src/reducers/initialState';
import api from '../../src/utils/api';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
window.localStorage = localStorage;

describe('Test suite for Meal Actions', () => {
  beforeEach(() => moxios.install());
  afterEach(() => moxios.uninstall());

  it('should return save meal success action and payload if save is successful', () => {
    const store = mockStore(initialState);
    const expectedResult = {
      type: types.SAVE_MEAL_SUCCESS,
      meal: saveMealResponse.meal,
    };
    moxios.stubRequest(api.meals.post, {
      status: 201,
      response: saveMealResponse,
    });
    const result = store.dispatch(saveMeal({}))
      .then(() => {
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedResult);
      });
  });

  it('should return save meal failed action if unable to save', () => {
    const store = mockStore(initialState);
    const expectedResult = {
      type: types.SAVE_MEAL_FAILED,
      errors: { name: saveMealFailedResponseB.errors.name.message },
    };
    moxios.stubRequest(api.meals.post, {
      status: 400,
      response: saveMealFailedResponseB,
    });
    const result = store.dispatch(saveMeal({}))
      .then(() => {
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedResult);
      });
  });

  it('should return save meal success action and payload if update is successful', () => {
    const store = mockStore(initialState);
    const expectedResult = {
      type: types.SAVE_MEAL_SUCCESS,
      meal: saveMealResponse.meal,
    };
    moxios.stubRequest(api.meals.put(1), {
      status: 201,
      response: saveMealResponse,
    });
    const result = store.dispatch(saveMeal({ id: 1 }))
      .then(() => {
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedResult);
      });
  });

  it('should return save meal failed action if unable to update', () => {
    const store = mockStore(initialState);
    const expectedResult = {
      type: types.SAVE_MEAL_FAILED,
      errors: { name: saveMealFailedResponseB.errors.name.message },
    };
    moxios.stubRequest(api.meals.put(1), {
      status: 400,
      response: saveMealFailedResponseB,
    });
    const result = store.dispatch(saveMeal({ id: 1 }))
      .then(() => {
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedResult);
      });
  });
});

describe('Test suite for Meal get Actions', () => {
  beforeEach(() => moxios.install());
  afterEach(() => moxios.uninstall());
  it('should return get meal success action with payload if get request is successful', () => {
    const store = mockStore(initialState);
    const expectedResult = {
      type: types.GET_MEAL_SUCCESS,
      meals: getMealsResponse.meals,
    };

    moxios.stubRequest(api.meals.get(10, 0), {
      status: 200,
      response: getMealsResponse,
    });

    return store.dispatch(getMeals())
      .then(() => {
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedResult);
      })
  });

  it('should return get meal failed action if get request fails', () => {
    const store = mockStore(initialState);
    const expectedResult = {
      type: types.GET_MEAL_FAILED,
      errors: { message: getMealsFailedResponse.message },
    };
    moxios.stubRequest(api.meals.get(10, 0), {
      status: 500,
      response: getMealsFailedResponse,
    });
    return store.dispatch(getMeals())
      .then(() => {
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedResult);
      });
  });
});

describe('Test suite for Meal delete Actions', () => {
  beforeEach(() => moxios.install());
  afterEach(() => moxios.uninstall());

  it('should return delete success action and payload if delete request is successful', () => {
    const store = mockStore(initialState);
    const expectedResult = {
      type: types.DELETE_MEAL_SUCCESS,
      mealId: saveMealResponse.meal.id,
    };
    moxios.stubRequest(api.meals.delete(saveMealResponse.meal.id), {
      status: 200,
      response: deleteMealResponse,
    });
    return store.dispatch(deleteMeal(saveMealResponse.meal.id))
      .then(() => {
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedResult);
      });
  });

  it('should return delete failed action and payload if delete request fails', () => {
    const store = mockStore(initialState);
    const expectedResult = {
      type: types.DELETE_MEAL_FAILED,
    };
    moxios.stubRequest(api.meals.delete(saveMealResponse.meal.id), {
      status: 401,
      response: deleteMealFailedResponse,
    });
    return store.dispatch(deleteMeal(saveMealResponse.meal.id))
      .then(() => {
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedResult);
      });
  });
});

import moxios from 'moxios';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { saveMeal } from '../../src/actions/mealActions';
import * as types from '../../src/actions/actionTypes';
import {
  validMeal,
  saveMealResponse,
  saveMealFailedResponse,
  saveMealFailedResponseB,
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
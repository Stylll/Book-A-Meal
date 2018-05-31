import mealReducer from '../../src/reducers/mealReducer';
import initialState from '../../src/reducers/initialState';
import { saveMealSuccess, saveMealFailed, getMealsSuccess, getMealsFailed } from '../../src/actions/mealActions';
import { SAVE_MEAL_SUCCESS, SAVE_MEAL_FAILED } from '../../src/actions/actionTypes';
import {
  validMeal, saveMealResponse, saveMealFailedResponse,
  saveMealFailedResponseB, getMealsResponse, getMealsFailedResponse,
} from '../helpers/mockMeals';

describe('Test Suite for Meal Reducer - SAVE', () => {
  it('should update state with meal when saved successfully', () => {
    const action = saveMealSuccess(saveMealResponse);
    const newState = mealReducer(initialState.meals, action);
    expect(newState.meals.length).toBe(1);
    expect(newState.meals[0].name).toBe(saveMealResponse.meal.name);
    expect(newState.meals[0].price).toBe(saveMealResponse.meal.price);
  });

  it('should update state with errors when saving fails', () => {
    const action = saveMealFailed(saveMealFailedResponse);
    const newState = mealReducer(initialState.meals, action);
    expect(newState.meals.length).toBe(0);
    expect(newState.errors.message).toBe(saveMealFailedResponse.message);
  });

  it('should not update state if action type is invalid', () => {
    const action = {
      type: null,
    };
    const newState = mealReducer(initialState.meals, action);
    expect(newState).toEqual(initialState.meals);
  });
});

describe('Test suite for Meal Reducer - GET', () => {
  it('should update state with meals when Get meal success action is passed', () => {
    const action = getMealsSuccess(getMealsResponse);
    const newState = mealReducer(initialState.meals, action);
    expect(newState.meals.length).toBeGreaterThan(1);
  });

  it('should update state with errors when get meal failed action is passed', () => {
    const action = getMealsFailed(getMealsFailedResponse);
    const newState = mealReducer(initialState.meals, action);
    expect(newState.errors.message).toEqual(getMealsFailedResponse.message);
  });
});

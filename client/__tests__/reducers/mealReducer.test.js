import mealReducer from '../../src/reducers/mealReducer';
import initialState from '../../src/reducers/initialState';
import { saveMealSuccess, saveMealFailed } from '../../src/actions/mealActions';
import { SAVE_MEAL_SUCCESS, SAVE_MEAL_FAILED } from '../../src/actions/actionTypes';
import { validMeal, saveMealResponse, saveMealFailedResponse, saveMealFailedResponseB } from '../helpers/mockMeals';

describe('Test Suite for Meal Reducer', () => {
  it('should update state with meal when saved successfully', () => {
    const action = saveMealSuccess(saveMealResponse);
    const newState = mealReducer(initialState.meals, action);
    console.log('action:', action);
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
})

import initialState from './initialState';
import * as types from '../actions/actionTypes';

const mealReducer = (state = initialState.meals, action) => {
  switch (action.type) {
    case types.SAVE_MEAL_SUCCESS:
      return {
        ...state,
        meals: [...state.meals, action.meal],
        errors: {},
      };

    case types.SAVE_MEAL_FAILED:
      return {
        ...state,
        errors: action.errors,
      };

    case types.GET_MEAL_SUCCESS:
      return {
        ...state,
        meals: action.meals,
      };

    case types.GET_MEAL_FAILED:
      return {
        ...state,
        errors: action.errors,
      };

    default:
      return state;
  }
};

export default mealReducer;
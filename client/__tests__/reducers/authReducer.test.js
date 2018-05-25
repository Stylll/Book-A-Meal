import { expect } from 'chai';
import authReducer from '../../src/reducers/authReducer';
import initialState from '../../src/reducers/initialState';
import { signupSuccess, signupFailed, signinFailed, signinSuccess } from '../../src/actions/authActions';
import { SIGNUP_SUCCESS, SIGNUP_FAILED } from '../../src/actions/actionTypes';
import { validCaterer, signupError, signupFailedResponse, signinFailedResponse } from '../helpers/mockData';

describe('Test suite for Auth Reducer', () => {
  it('should update state if signup is successful', () => {
    const action = signupSuccess(validCaterer);
    const newState = authReducer(initialState.auth, action);
    expect(newState.user).to.eql(validCaterer);
    expect(newState.isAuthenticated).to.equal(true);
    expect(newState.isCaterer).to.equal(true);
    expect(newState.errors).to.eql({});
  });

  it('should update state with errors if signup failed', () => {
    const action = signupFailed(signupFailedResponse.errors);
    const newState = authReducer(initialState.auth, action);
    expect(newState.user).to.eql(initialState.auth.user);
    expect(newState.isAuthenticated).to.equal(false);
    expect(newState.isCaterer).to.equal(false);
    expect(newState.errors.email).to.equal(signupError.email);
    expect(newState.errors.username).to.equal(signupError.username);
  });

  it('should not update state for unknown action type', () => {
    const action = {
      type: null,
    };
    const newState = authReducer(initialState.auth, action);
    expect(newState).to.equal(initialState.auth);
  });

  it('should update state if signin is successful', () => {
    const action = signinSuccess(validCaterer);
    const newState = authReducer(initialState.auth, action);
    expect(newState.user).to.eql(validCaterer);
    expect(newState.isAuthenticated).to.equal(true);
    expect(newState.isCaterer).to.equal(true);
    expect(newState.errors).to.eql({});
  });

  it('should update state with error message if signin failed', () => {
    const action = signinFailed(signinFailedResponse.message);
    const newState = authReducer(initialState.auth, action);
    expect(newState.user).to.eql(initialState.auth.user);
    expect(newState.isAuthenticated).to.equal(false);
    expect(newState.isCaterer).to.equal(false);
    expect(newState.errors.message).to.equal(signinFailedResponse.message);
  });
});
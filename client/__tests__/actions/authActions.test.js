import { expect } from 'chai';
import moxios from 'moxios';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { signup, signin } from '../../src/actions/authActions';
import * as types from '../../src/actions/actionTypes';
import {
  signupSuccessResponse,
  signupFailedResponse,
  signupError,
  signinSuccessResponse,
  signinFailedResponse,
  signinFailedResponseB,
} from '../helpers/mockData';
import localStorage from '../helpers/mockLocalStorage';
import initialState from '../../src/reducers/initialState';
import api from '../../src/utils/api';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
window.localStorage = localStorage;

describe('Test Suite for Auth Actions', () => {
  beforeEach(() => moxios.install());
  afterEach(() => moxios.uninstall());

  it('should return signup success action type and user when signup is successful', () => {
    const store = mockStore(initialState);
    const expectedAction = {
      type: types.SIGNUP_SUCCESS,
      user: signupSuccessResponse.user,
    };

    moxios.stubRequest(api.user.signUp, {
      status: 201,
      response: signupSuccessResponse,
    });

    return store.dispatch(signup({}))
      .then(() => {
        const actions = store.getActions();
        expect(actions[1]).to.eql(expectedAction);
      });
  });

  it('should return signup failed action type and errors when signup fails', () => {
    const store = mockStore(initialState);
    const expectedAction = {
      type: types.SIGNUP_FAILED,
      errors: signupError,
    };

    moxios.stubRequest(api.user.signUp, {
      status: 400,
      response: signupFailedResponse,
    });

    return store.dispatch(signup({}))
      .then(() => {
        const actions = store.getActions();
        expect(actions[1]).to.eql(expectedAction);
      });
  });

  it('should dispatch signin success action type and payload when signin is successful', () => {
    const store = mockStore(initialState);
    const expectedAction = {
      type: types.SIGNIN_SUCCESS,
      user: signinSuccessResponse.user,
    };
    moxios.stubRequest(api.user.signin, {
      status: 200,
      response: signinSuccessResponse,
    });

    return store.dispatch(signin({}))
      .then(() => {
        const actions = store.getActions();
        expect(actions[1]).to.eql(expectedAction);
      });
  });

  it('should dispatch signin failed action type and payload when signin fails', () => {
    const store = mockStore(initialState);
    const expectedAction = {
      type: types.SIGNIN_FAILED,
      errors: { message: signinFailedResponse.message },
    };
    moxios.stubRequest(api.user.signin, {
      status: 401,
      response: signinFailedResponse,
    });

    return store.dispatch(signin({}))
      .then(() => {
        const actions = store.getActions();
        expect(actions[1]).to.eql(expectedAction);
      });
  });

  it('should dispatch signin failed action type with payload B when signin fails', () => {
    const store = mockStore(initialState);
    const expectedAction = {
      type: types.SIGNIN_FAILED,
      errors: { email: signinFailedResponseB.errors.email.message },
    };
    moxios.stubRequest(api.user.signin, {
      status: 400,
      response: signinFailedResponseB,
    });

    return store.dispatch(signin({}))
      .then(() => {
        const actions = store.getActions();
        expect(actions[1]).to.eql(expectedAction);
      });
  });
});

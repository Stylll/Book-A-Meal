import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import ConnectedEditMenu, { EditMenu } from '../../../src/components/menu/EditMenu';
import { validMenu, emptyMenu, invalidMenu, saveMenuResponse } from '../../helpers/mockMenu';
import { saveMealResponse } from '../../helpers/mockMeals';
import { validateMenuInput } from '../../../src/utils/validateInput';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const store = mockStore({
  menus: {
    menu: {},
    errors: {},
    pagination: {},
  },
  meals: {
    meals: [],
  },
});

const setup = () => {
  const props = {
    actions: {
      saveMenu: () => (Promise.resolve()),
      getMenuById: () => (Promise.resolve()),
    },
    menu: saveMenuResponse.menu,
    meals: [saveMealResponse.meal],
    errors: {},
    match: {
      params: {
        id: 0,
      },
    },
  };
  return shallow(<EditMenu {...props} />);
};

describe('Test Suite for EditMenu component', () => {
  it('should render unconnected component properly', () => {
    const wrapper = setup();
    expect(wrapper.find('h1').first().text()).toBe('Add Meals to Menu');
    expect(wrapper.find('h2').first().text()).toBe(saveMenuResponse.menu.name);
    expect(wrapper.find('input').first().prop('type')).toBe('button');
    expect(wrapper.find('input').length).toBe(1);
    expect(wrapper.find('NavLink').length).toBe(1);
  });

  it('should render connected component properly', () => {
    const props = {
      actions: {
        saveMenu: () => (Promise.resolve()),
        getMenuById: () => (Promise.resolve()),
      },
      meals: [],
      menu: saveMenuResponse.menu,
      errors: {},
      match: {
        params: {
          id: 0,
        },
      },
    };
    const wrapper = shallow(<ConnectedEditMenu store={store} {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('should return error when an empty meals array is submitted', () => {
    const wrapper = setup();
    wrapper.setState({
      mealIds: emptyMenu.mealIds,
    });
    const handleSubmitSpy = jest.spyOn(wrapper.instance(), 'handleSubmit');
    const event = {
      preventDefault: jest.fn(),
    };
    wrapper.instance().handleSubmit(event);
    expect(wrapper.state().errors.mealIds).toBe('Meal options cannot be empty');
    expect(handleSubmitSpy).toHaveBeenCalled();
  });

  it('should return error when an invalid meals array is submitted', () => {
    const wrapper = setup();
    wrapper.setState({
      mealIds: invalidMenu.mealIds,
    });
    const handleSubmitSpy = jest.spyOn(wrapper.instance(), 'handleSubmit');
    const event = {
      preventDefault: jest.fn(),
    };
    wrapper.instance().handleSubmit(event);
    expect(wrapper.state().errors.mealIds).toBe('One or more of the meal options are invalid');
    expect(handleSubmitSpy).toHaveBeenCalled();
  });

  it('should update state with meal id and call handleAdd', () => {
    const wrapper = setup();
    wrapper.setState({
      mealIds: [],
      mealOption: saveMealResponse.meal,
    });
    const handleAdd = jest.spyOn(wrapper.instance(), 'handleAdd');
    const event = {
      preventDefault: jest.fn(),
    };
    wrapper.instance().handleAdd(event);
    expect(handleAdd).toHaveBeenCalled();
    expect(wrapper.state().mealIds).toEqual([5]);
  });

  it('shouild call saveMenu action when handleSubmit function is called', () => {
    const wrapper = setup();
    wrapper.setState({
      mealIds: validMenu.mealIds,
    });
    const handleSubmitSpy = jest.spyOn(wrapper.instance(), 'handleSubmit');
    const saveMenuSpy = jest.spyOn(wrapper.instance().props.actions, 'saveMenu');
    const event = {
      preventDefault: jest.fn(),
    };
    wrapper.instance().handleSubmit(event);
    expect(handleSubmitSpy).toHaveBeenCalled();
    expect(saveMenuSpy).toHaveBeenCalled();
  });

  it('should update state when updateOption function is called', () => {
    const wrapper = setup();
    const updateOptionSpy = jest.spyOn(wrapper.instance(), 'updateOption');
    wrapper.instance().updateOption(saveMealResponse.meal);
    expect(updateOptionSpy).toHaveBeenCalled();
    expect(wrapper.state().mealOption).toEqual(saveMealResponse.meal);
  });

  it('should update state when removeMeal function is called', () => {
    const wrapper = setup();
    wrapper.setState({
      mealIds: [1, 2, 3, 4, 5],
    });
    const event = {
      preventDefault: jest.fn(),
      target: {
        id: 1,
      },
    };
    const removeMealSpy = jest.spyOn(wrapper.instance(), 'removeMeal');
    wrapper.instance().removeMeal(event);
    expect(removeMealSpy).toHaveBeenCalled();
    expect(wrapper.state().mealIds).toEqual([2, 3, 4, 5]);
  });

  it('should call handleChange method when componentWillReceiveProps method is called', () => {
    const wrapper = setup();
    const props = {
      actions: {
        saveMenu: () => (Promise.resolve()),
        getMenuById: () => (Promise.resolve()),
      },
      menu: saveMenuResponse.menu,
      meals: [saveMealResponse.meal],
      errors: {},
      match: {
        params: {
          id: 1,
        },
      },
    };
    const handleChangeSpy = jest.spyOn(wrapper.instance(), 'handlePageChange');
    wrapper.instance().componentWillReceiveProps(props);
    expect(handleChangeSpy).toHaveBeenCalled();
  });

  it('should update state and call getMenuById action when fetchData method is called', () => {
    const props = {
      actions: {
        saveMenu: () => (Promise.resolve()),
        getMenuById: jest.fn(),
      },
      menu: saveMenuResponse.menu,
      meals: [saveMealResponse.meal],
      errors: {},
      match: {
        params: {
          id: 1,
        },
      },
    };
    const wrapper = shallow(<EditMenu {...props} />);
    wrapper.instance().fetchData({ selected: 1 });
    expect(wrapper.state().loading).toBe(true);
    expect(wrapper.state().id).toBe(1);
    expect(props.actions.getMenuById).toHaveBeenCalled();
  });
});

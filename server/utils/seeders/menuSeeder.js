import Menus from '../../db/menus';
import { getNormalDate, getCurrentBeautifiedDate } from '../dateBeautifier';

/**
 * This script contains template menu data to use for test.
 */
const validMenu1 = {
  name: 'Menu For Monday, 23 April 2018',
  date: '2018-04-23',
  userId: 1,
  mealIds: [1, 2],
};

const validMenu2 = {
  name: 'Menu For Tuesday, 24 April 2018',
  date: '2018-04-24',
  userId: 1,
  mealIds: [1, 2],
};

const invalidMenu3 = {
  name: 'Menu For Wednesday, 25 April 2018',
  date: '',
  userId: 0,
};

const existingMenu = {
  name: 'Menu For Sunday, 22 April 2018',
  date: '2018-04-22',
  userId: 1,
  mealIds: [1, 2],
};

const currentMenu = {
  name: `Menu For ${getCurrentBeautifiedDate()}`,
  date: getNormalDate(new Date()),
  userId: 1,
  mealIds: [1, 2],
};

/**
 * insert menu into menu table
 * @param {object} menu
 */
const insertSeedMenu = (menu) => {
  Menus.add(menu);
};

/**
 * truncate menus table
 */
const clearMenus = () => {
  Menus.truncate();
};

export {
  validMenu1,
  validMenu2,
  invalidMenu3,
  existingMenu,
  currentMenu,
  insertSeedMenu,
  clearMenus,
};

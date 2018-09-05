import Menus from '../../db/menus';
import { getNormalDate, getCurrentBeautifiedDate } from '../dateBeautifier';

/**
 * This script contains template menu data to use for test.
 */
const menuFor23April18 = {
  name: 'Menu For Monday, 23 April 2018',
  date: '2018-04-23',
  userId: 1,
  mealIds: [1, 2],
};

const menuFor24April18 = {
  name: 'Menu For Tuesday, 24 April 2018',
  date: '2018-04-24',
  userId: 1,
  mealIds: [1, 2],
};

const invalidMenu = {
  name: 'Menu For Wednesday, 25 April 2018',
  date: '',
  userId: 0,
};

const menuFor22April18 = {
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
const insertSeedMenu = async (menu) => {
  await Menus.add(menu);
};

/**
 * truncate menus table
 */
const clearMenus = async () => {
  await Menus.truncate();
};

export {
  menuFor23April18,
  menuFor24April18,
  invalidMenu,
  menuFor22April18,
  currentMenu,
  insertSeedMenu,
  clearMenus,
};

import Menus from '../../db/menus';
import { getNormalDate, getCurrentBeautifiedDate } from '../dateBeautifier';

/**
 * This script contains template menu data to use for test.
 */
const validMenu1 = {
  name: 'Menu For Monday, 23 April 2018',
  date: '2018-04-23',
  userId: 1,
};

const validMenu2 = {
  name: 'Menu For Tuesday, 24 April 2018',
  date: '2018-04-24',
  userId: 1,
};

const invalidMenu3 = {
  name: 'Menu For Wednesday, 25 April 2018',
  date: '',
  userId: 0,
};

const existingMenu = {
  name: 'Menu For Thursday, 26 April 2018',
  date: '2018-04-26',
  userId: 1,
};

const currentMenu = {
  name: `Menu For ${getCurrentBeautifiedDate()}`,
  date: getNormalDate(new Date()),
  userId: 1,
};

const insertSeedMenu = (menu) => {
  Menus.add(menu);
};

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

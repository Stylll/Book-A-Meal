import Menus from '../../db/menus';

/**
 * This script contains template menu data to use for test.
 */
const validMenu1 = {
  name: 'Menu For Monday, 23 April 2018',
  date: '2018-04-23',
};

const validMenu2 = {
  name: 'Menu For Tuesday, 24 April 2018',
  date: '2018-04-24',
};

const invalidMenu3 = {
  name: 'Menu For Wednesday, 25 April 2018',
  date: '',
};

const existingMenu = {
  name: 'Menu For Thursday, 26 April 2018',
  date: '2018-04-26',
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
  insertSeedMenu,
  clearMenus,
};

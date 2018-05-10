import 'babel-polyfill';
import { expect } from 'chai';
import menus from '../../db/menus';
import {
  validMenu1,
  validMenu2,
  invalidMenu3,
  existingMenu,
  insertSeedMenu,
  clearMenus,
} from '../../utils/seeders/menuSeeder';
import { existingMeal, insertSeedMeal, clearMeals } from '../../utils/seeders/mealSeeder';
import {
  existingUser,
  insertSeedUsers,
  clearUsers,
} from '../../utils/seeders/userSeeder';

/* eslint-disable no-undef */
describe('Test Suite for Menu Model', () => {
  before(async () => {
    await clearUsers();
    await insertSeedUsers(existingUser);
  });
  // before each hook to run before every test
  beforeEach(async () => {
    await clearMenus();
    await clearMeals();
    await insertSeedMenu(existingMenu);
    await insertSeedMeal(existingMeal);
  });

  it('should require menu date', async () => {
    const result = await menus.add(invalidMenu3);
    expect(result.err.message).to.equal('Menu date is required');
  });

  it('should require valid menu date', async () => {
    const result = await menus.add({ date: 'djddd' });
    expect(result.err.message).to.equal('Menu date is invalid');
  });

  it('should require unique menu date', async () => {
    const result = await menus.add(existingMenu);
    expect(result.err.message).to.equal('Menu date already exists');
  });

  it('should require mealIds', async () => {
    const result = await menus.add({
      ...invalidMenu3,
      date: validMenu1.date,
      userId: validMenu1.userId,
    });
    expect(result.err.message).to.equal('Meal Ids are required');
  });

  it('should require mealIds in array format', async () => {
    const result = await menus.add({ ...validMenu1, mealIds: { 1: 'a', 2: 'b' } });
    expect(result.err.message).to.equal('Meal Ids should be in an array');
  });

  it('should only insert existing meal ids', async () => {
    const result = await menus.add(validMenu1);
    expect(result.name).to.equal(validMenu1.name);
    expect(result.mealIds).to.be.an('array');
    expect(result.mealIds.length).to.not.be.greaterThan(1);
    expect(result.mealIds[0]).to.equal(1);
  });

  it('should add menu and autogenerate menu name', async () => {
    const result = await menus.add(validMenu1);
    expect(result.name).to.equal(validMenu1.name);
  });

  it('should get menu', async () => {
    const result = await menus.get(1);
    expect(result.name).to.equal(existingMenu.name);
    expect(result.date).to.equal(existingMenu.date);
    expect(result).to.haveOwnProperty('id');
  });

  it('should require a user id', async () => {
    const result = await menus.add({
      date: validMenu1.date,
      userId: 0,
    });
    expect(result.err.message).to.equal('User id is required');
  });

  it('should delete menu', async () => {
    await menus.delete(1);
    const result = await menus.get(1);
    expect(result).to.equal(undefined);
  });

  it('should require valid menu date before updating', async () => {
    const result = await menus.update({ id: 1, date: 'djddd' });
    expect(result.err.message).to.equal('Menu date is invalid');
  });

  it('should require mealIds before updating', async () => {
    const result = await menus.update({
      ...invalidMenu3, date: validMenu2.date, userId: existingMenu.userId, id: 1,
    });
    expect(result.err.message).to.equal('Meal Ids are required');
  });

  it('should require mealIds in array format before updating', async () => {
    const result = await menus.update({
      ...existingMenu, date: validMenu2.date, id: 1, mealIds: { 1: 'a', 2: 'b' },
    });
    expect(result.err.message).to.equal('Meal Ids should be in an array');
  });

  it('should only update existing meal ids', async () => {
    const result = await menus.update({ ...validMenu1, id: 1 });
    expect(result.name).to.equal(validMenu1.name);
    expect(result.mealIds).to.be.an('array');
    expect(result.mealIds.length).to.not.be.greaterThan(1);
    expect(result.mealIds[0]).to.equal(1);
  });

  it('should update menu date', async () => {
    const result = await menus.update({
      date: '2018-03-01',
      id: 1,
      userId: 1,
      mealIds: [1, 2, 3],
    });
    expect(result.name).to.equal('Menu For Thursday, 1 March 2018');
  });

  it('should get menu by date', async () => {
    const result = await menus.getByDate(existingMenu.date);
    expect(result.name).to.equal(existingMenu.name);
  });

  it('should get all menus', async () => {
    await menus.add(validMenu1);
    await menus.add(validMenu2);
    const result = await menus.getAll();
    expect(result).to.be.an('array');
    expect(result.length).to.equal(3);
    expect(result[0].name).to.equal(existingMenu.name);
    expect(result[0].date).to.equal(existingMenu.date);
    expect(result[0]).to.haveOwnProperty('id');
  });

  it('should delete all menu from the menu data store', async () => {
    await menus.truncate();
    const result = await menus.getAll();
    expect(result.length).to.equal(0);
  });
});

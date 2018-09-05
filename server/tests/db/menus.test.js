import 'babel-polyfill';
import { expect } from 'chai';
import menus from '../../db/menus';
import {
  menuFor23April18,
  menuFor24April18,
  invalidMenu,
  menuFor22April18,
  insertSeedMenu,
  clearMenus,
} from '../../utils/seeders/menuSeeder';
import { curryRice, insertSeedMeal, clearMeals } from '../../utils/seeders/mealSeeder';
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
    await insertSeedMenu(menuFor22April18);
    await insertSeedMeal(curryRice);
  });

  it('should require menu date', async () => {
    const result = await menus.add(invalidMenu);
    expect(result.err.message).to.equal('Menu date is required');
  });

  it('should require valid menu date', async () => {
    const result = await menus.add({ date: 'djddd' });
    expect(result.err.message).to.equal('Menu date is invalid');
  });

  it('should require unique menu date', async () => {
    const result = await menus.add(menuFor22April18);
    expect(result.err.message).to.equal('Menu date already exists');
  });

  it('should require mealIds', async () => {
    const result = await menus.add({
      ...invalidMenu,
      date: menuFor23April18.date,
      userId: menuFor23April18.userId,
    });
    expect(result.err.message).to.equal('Meal Ids are required');
  });

  it('should require mealIds in array format', async () => {
    const result = await menus.add({ ...menuFor23April18, mealIds: { 1: 'a', 2: 'b' } });
    expect(result.err.message).to.equal('Meal Ids should be in an array');
  });

  it('should only insert existing meal ids', async () => {
    const result = await menus.add(menuFor23April18);
    expect(result.name).to.equal(menuFor23April18.name);
    expect(result.mealIds).to.be.an('array');
    expect(result.mealIds.length).to.not.be.greaterThan(1);
    expect(result.mealIds[0]).to.equal(1);
  });

  it('should add menu and autogenerate menu name', async () => {
    const result = await menus.add(menuFor23April18);
    expect(result.name).to.equal(menuFor23April18.name);
  });

  it('should get menu', async () => {
    const result = await menus.get(1);
    expect(result.name).to.equal(menuFor22April18.name);
    expect(result.date).to.equal(menuFor22April18.date);
    expect(result.id).to.equal(1);
  });

  it('should require a user id', async () => {
    const result = await menus.add({
      date: menuFor23April18.date,
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
      ...invalidMenu, date: menuFor24April18.date, userId: menuFor22April18.userId, id: 1,
    });
    expect(result.err.message).to.equal('Meal Ids are required');
  });

  it('should require mealIds in array format before updating', async () => {
    const result = await menus.update({
      ...menuFor22April18, date: menuFor24April18.date, id: 1, mealIds: { 1: 'a', 2: 'b' },
    });
    expect(result.err.message).to.equal('Meal Ids should be in an array');
  });

  it('should only update existing meal ids', async () => {
    const result = await menus.update({ ...menuFor23April18, id: 1 });
    expect(result.name).to.equal(menuFor23April18.name);
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
    const result = await menus.getByDate(menuFor22April18.date);
    expect(result.menu.name).to.equal(menuFor22April18.name);
  });

  it('should get all menus', async () => {
    await menus.add(menuFor23April18);
    await menus.add(menuFor24April18);
    const result = await menus.getAll();
    expect(result.menus).to.be.an('array');
    expect(result.menus.length).to.equal(3);
    expect(result.menus[0].name).to.equal(menuFor24April18.name);
    expect(result.menus[0].date).to.equal(menuFor24April18.date);
    expect(result.menus[0].id).to.equal(3);
  });

  it('should delete all menu from the menu data store', async () => {
    await menus.truncate();
    const result = await menus.getAll();
    expect(result.menus.length).to.equal(0);
  });
});

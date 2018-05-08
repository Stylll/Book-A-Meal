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

/* eslint-disable no-undef */
describe('Test Suite for Menu Model', () => {
  // before each hook to run before every test
  beforeEach(() => {
    clearMenus();
    clearMeals();
    insertSeedMenu(existingMenu);
    insertSeedMeal(existingMeal);
  });

  it('should require menu date', () => {
    const result = menus.add(invalidMenu3);
    expect(result.err.message).to.equal('Menu date is required');
  });

  it('should require valid menu date', () => {
    const result = menus.add({ date: 'djddd' });
    expect(result.err.message).to.equal('Menu date is invalid');
  });

  it('should require unique menu date', () => {
    const result = menus.add(existingMenu);
    expect(result.err.message).to.equal('Menu date already exists');
  });

  it('should require mealIds', () => {
    const result = menus.add({ ...invalidMenu3, date: validMenu1.date, userId: validMenu1.userId });
    expect(result.err.message).to.equal('Meal Ids are required');
  });

  it('should require mealIds in array format', () => {
    const result = menus.add({ ...validMenu1, mealIds: { 1: 'a', 2: 'b' } });
    expect(result.err.message).to.equal('Meal Ids should be in an array');
  });

  it('should only insert existing meal ids', () => {
    const result = menus.add(validMenu1);
    expect(result.name).to.equal(validMenu1.name);
    expect(result.mealIds).to.be.an('array');
    expect(result.mealIds.length).to.not.be.greaterThan(1);
    expect(result.mealIds[0]).to.equal(1);
  });

  it('should add menu and autogenerate menu name', () => {
    const result = menus.add(validMenu1);
    expect(result.name).to.equal(validMenu1.name);
  });

  it('should add bulk menu', () => {
    menus.addBulk([validMenu1, validMenu2]);
    expect(menus.getAll().length).to.equal(3);
  });

  it('should get menu', () => {
    const result = menus.get(1);
    expect(result.name).to.equal(existingMenu.name);
    expect(result.date).to.equal(existingMenu.date);
    expect(result).to.haveOwnProperty('id');
  });

  it('should require a user id', () => {
    const result = menus.add({
      date: validMenu1.date,
      userId: 0,
    });
    expect(result.err.message).to.equal('User id is required');
  });

  it('should delete menu', () => {
    menus.delete(1);
    expect(menus.get(1)).to.equal(undefined);
  });

  it('should require unique menu date when updating', () => {
    const result = menus.update({ id: 1, ...existingMenu });
    expect(result.err.message).to.equal('Menu date already exists');
  });

  it('should require valid menu date before updating', () => {
    const result = menus.update({ id: 1, date: 'djddd' });
    expect(result.err.message).to.equal('Menu date is invalid');
  });

  it('should require mealIds before updating', () => {
    const result = menus.update({
      ...invalidMenu3, date: validMenu2.date, userId: existingMenu.userId, id: 1,
    });
    expect(result.err.message).to.equal('Meal Ids are required');
  });

  it('should require mealIds in array format before updating', () => {
    const result = menus.update({
      ...existingMenu, date: validMenu2.date, id: 1, mealIds: { 1: 'a', 2: 'b' },
    });
    expect(result.err.message).to.equal('Meal Ids should be in an array');
  });

  it('should only update existing meal ids', () => {
    const result = menus.update({ ...validMenu1, id: 1 });
    expect(result.name).to.equal(validMenu1.name);
    expect(result.mealIds).to.be.an('array');
    expect(result.mealIds.length).to.not.be.greaterThan(1);
    expect(result.mealIds[0]).to.equal(1);
  });

  it('should update menu date', () => {
    const result = menus.update({
      date: '2018-03-01',
      id: 1,
      userId: 1,
      mealIds: [1, 2, 3],
    });
    expect(result.name).to.equal('Menu For Thursday, 1 March 2018');
  });

  it('should get menu by date', () => {
    const result = menus.getByDate(existingMenu.date);
    expect(result.name).to.equal(existingMenu.name);
  });

  it('should get all menus', () => {
    menus.addBulk([validMenu1, validMenu2]);
    const result = menus.getAll();
    expect(result).to.be.an('array');
    expect(result[0].name).to.equal(existingMenu.name);
    expect(result[0].date).to.equal(existingMenu.date);
    expect(result[0]).to.haveOwnProperty('id');
  });

  it('should delete all menu from the menu data store', () => {
    menus.truncate();
    expect(menus.getAll().length).to.equal(0);
  });
});

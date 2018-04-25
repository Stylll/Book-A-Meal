import { expect } from 'chai';
import menuMeals from '../../db/menuMeals';
import {
  validMenuMeal1,
  validMenuMeal2,
  invalidMenuMeal3,
  existingMenuMeal,
  insertSeedMenuMeal,
  clearMenuMeal,
} from '../../utils/seeders/menuMealSeeder';

import {
  validMenu1,
  validMenu2,
  existingMenu,
  insertSeedMenu,
  clearMenus,
} from '../../utils/seeders/menuSeeder';

import {
  validMeal1,
  validMeal2,
  existingMeal,
  insertSeedMeal,
  clearMeals,
} from '../../utils/seeders/mealSeeder';

import {
  existingUser,
  insertSeedUsers,
  clearUsers,
} from '../../utils/seeders/userSeeder';

/* eslint-disable no-undef */
describe('Test Suite for MenuMeal Model', () => {
  /**
   * before each hook to populate db with required data
   *
   */
  beforeEach(() => {
    clearUsers();
    clearMeals();
    clearMenus();
    clearMenuMeal();
    insertSeedUsers(existingUser);
    insertSeedMeal(existingMeal);
    insertSeedMeal(validMeal1);
    insertSeedMeal(validMeal2);
    insertSeedMenu(existingMenu);
    insertSeedMenu(validMenu1);
    insertSeedMenu(validMenu2);
    insertSeedMenuMeal(existingMenuMeal);
  });

  it('should require menu id before adding', () => {
    const result = menuMeals.add(invalidMenuMeal3);
    expect(result.err.message).to.equal('Menu id is required');
  });

  it('should require existing menu id before adding', () => {
    const result = menuMeals.add({ menuId: 55 });
    expect(result.err.message).to.equal('Menu does not exist');
  });

  it('should require meal id before adding', () => {
    const result = menuMeals.add({
      menuId: validMenuMeal1.menuId,
      mealId: invalidMenuMeal3.mealId,
    });
    expect(result.err.message).to.equal('Meal id is required');
  });

  it('should requre existing meal id before adding', () => {
    const result = menuMeals.add({
      menuId: validMenuMeal1.menuId,
      mealId: 55,
    });
    expect(result.err.message).to.equal('Meal does not exist');
  });

  it('should require menumeal id to get meals by id', () => {
    const result = menuMeals.get(0);
    expect(result.err.message).to.equal('MenuMeal id is required');
  });

  it('should get meals by id', () => {
    const result = menuMeals.get(1);
    expect(result).to.be.an('object');
    expect(result.mealId).to.equal(existingMenuMeal.mealId);
    expect(result.menuId).to.equal(existingMenuMeal.menuId);
    expect(result).to.haveOwnProperty('createdAt');
    expect(result).to.haveOwnProperty('updatedAt');
  });

  it('should require menu id to get by menu id', () => {
    const result = menuMeals.getByMenuId(invalidMenuMeal3.menuId);
    expect(result.err.message).to.equal('Menu id is required');
  });

  it('should return meal and menu with valid menu id', () => {
    const result = menuMeals.getByMenuId(existingMenuMeal.menuId);
    expect(result).to.be.an('array');
    expect(result[0].mealId).to.equal(existingMeal.mealId);
    expect(result[0].menuId).to.equal(existingMeal.menuId);
  });

  it('should add meal to a menu', () => {
    const result = menuMeals.add(validMenuMeal1);
    expect(result).to.be.an('object');
    expect(result.mealId).to.equal(validMenuMeal1.mealId);
    expect(result.menuId).to.equal(validMenuMeal1.menuId);
    expect(result).to.haveOwnProperty('createdAt');
    expect(result).to.haveOwnProperty('updatedAt');
  });

  it('should require a unique meal', () => {
    const result = menuMeals.add(existingMenuMeal);
    expect(result.err.message).to.equal('Meal already exists');
  });

  it('should return all menu meal records', () => {
    menuMeals.addBulk([validMenuMeal1, validMenuMeal2]);
    const result = menuMeals.getAll();
    expect(result).to.be.an('array');
    expect(result[0].mealId).to.equal(existingMeal.mealId);
    expect(result[0].menuId).to.equal(existingMeal.menuId);
    expect(result[0]).to.haveOwnProperty('createdAt');
    expect(result[0]).to.haveOwnProperty('updatedAt');
    expect(result.length).to.be.greaterThan(1);
  });

  it('should require menu meal id before deletion', () => {
    const result = menuMeals.delete(0);
    expect(result.err.message).to.equal('Menumeal id is required');
  });

  it('should delete menu meal by menu meal id', () => {
    menuMeals.delete(1);
    expect(menuMeals.get(1)).to.equal(undefined);
  });

  it('should require menu id before deletion with menu id', () => {
    menuMeals.deleteByMenuId(0);
    expect(result.err.message).to.equal('Menu id is required');
  });

  it('should delete menu meal with menu id', () => {
    menuMeals.deleteByMenuId(1);
    expect(menuMeals.getByMenuId(1)).to.equal(undefined);
  });

  it('should delete all records in menumeal table', () => {
    menuMeals.truncate();
    expect(menuMeals.getAll().length).to.equal(0);
  });
});

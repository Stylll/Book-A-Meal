import 'babel-polyfill';
import { clearUsers, insertSeedUsers, validUser2 } from '../../server/utils/seeders/userSeeder';
import { clearMeals, insertSeedMeal, validMeal1, validMeal2 } from '../../server/utils/seeders/mealSeeder';
import { clearMenus, insertSeedMenu, validMenu1, validMenu2 } from '../../server/utils/seeders/menuSeeder';

module.exports = {
  before: async (browser) => {
    await clearUsers();
    await insertSeedUsers(validUser2);
    await clearMeals();
    await insertSeedMeal(validMeal1);
    await insertSeedMeal(validMeal2);
    await clearMenus();
  },
  after: (browser) => {
    browser.end();
  },
  'Caterer can create a menu with a meal': function (browser) {
    browser
      .url('http://localhost:3000/users/signin')
      .waitForElementVisible('.signin-content', 1000)
      .setValue('#email', validUser2.email)
      .setValue('#password', validUser2.password)
      .click('#app > div > div > div > div.signin-overall > div.signin-content > div:nth-child(2) > div:nth-child(7) > input')
      .pause(5000)
      .url('http://localhost:3000/caterer/menus/edit')
      .waitForElementVisible('.menu-form', 1000)
      .assert.containsText('#app > div > div > div > div.container.text-center.black-text.menu-form > h2', 'Menu For Today')
      .assert.elementPresent('#searchDropdownContainer > div > input[type="text"]')
      .assert.elementPresent('#app > div > div > div > div.container.text-center.black-text.menu-form > div:nth-child(4) > input')
      .assert.elementPresent('#app > div > div > div > div.container.text-center.black-text.menu-form > div:nth-child(4) > a')
      .click('#searchDropdownContainer > div > input[type="text"]')
      .pause(3000)
      .click('#searchDropdownContainer > div > div > div')
      .pause(3000)
      .click('#app > div > div > div > div.container.text-center.black-text.menu-form > div:nth-child(4) > input')
      .pause(3000)
      .assert.elementPresent('#app > div > div > div > div:nth-child(7) > div')
      .assert.elementPresent('#app > div > div > div > div:nth-child(7) > div > div')
      .assert.elementPresent('#app > div > div > div > div:nth-child(7) > div > div > div.flexleft > h3')
      .assert.elementPresent('#app > div > div > div > div:nth-child(7) > div > div > div:nth-child(2) > a')
      .assert.elementPresent('#app > div > div > div > div:nth-child(7) > div > div > div:nth-child(3) > a');
  },
  'Caterer can view the list of menu': function (browser) {
    browser
      .url('http://localhost:3000/caterer/menus')
      .waitForElementVisible('body', 1000)
      .assert.containsText('#app > div > div > div > div:nth-child(3) > h1', 'Manage Menus')
      .assert.elementPresent('#app > div > div > div > div:nth-child(3) > div > div > form > input.textbox.datepicker.menu-textbox')
      .assert.elementPresent('#app > div > div > div > div.container.text-center.create-menu > a')
      .assert.elementPresent('#app > div > div > div > div:nth-child(7) > div > div')
      .assert.elementPresent('#app > div > div > div > div:nth-child(7) > div > div')
      .assert.containsText('#app > div > div > div > div:nth-child(7) > div > div > div:nth-child(2) > a', 'Edit')
      .assert.containsText('#app > div > div > div > div:nth-child(7) > div > div > div:nth-child(3) > a', 'View')
      .assert.elementPresent('#app > div > div > div > div:nth-child(7) > ul');
  },
  'Caterer can view the list of meals in a menu': function (browser) {
    browser
      .url('http://localhost:3000/caterer/menus/view/1')
      .waitForElementVisible('body', 1000)
      .pause(5000)
      .assert.containsText('#app > div > div > div > div:nth-child(3) > h1', 'View Menu Options')
      .assert.elementPresent('.card-container')
      .assert.elementPresent('.card-img-container')
      .assert.elementPresent('#app > div > div > div > div:nth-child(4) > div > div:nth-child(1) > div.card-img-container > img')
      .assert.elementPresent('#app > div > div > div > div:nth-child(4) > div > div:nth-child(1) > div.card-content')
      .assert.containsText('#app > div > div > div > div:nth-child(4) > div > div:nth-child(1) > div.card-content > div.card-text.black-text > h3', validMeal2.name)
      .assert.containsText('#app > div > div > div > div:nth-child(4) > div > div:nth-child(1) > div.card-content > div.card-text.black-text > h4', validMeal2.price)
      .assert.elementPresent('#app > div > div > div > div:nth-child(4) > ul');
  },
  'Caterer can edit a menu and add more meals': function (browser) {
    browser
      .url('http://localhost:3000/caterer/menus/edit/1')
      .waitForElementVisible('body', 1000)
      .waitForElementVisible('.menu-form', 1000)
      .assert.elementPresent('#searchDropdownContainer > div > input[type="text"]')
      .assert.elementPresent('#app > div > div > div > div.container.text-center.black-text.menu-form > div:nth-child(4) > input')
      .assert.elementPresent('#app > div > div > div > div.container.text-center.black-text.menu-form > div:nth-child(4) > a')
      .assert.elementPresent('#app > div > div > div > div.container.text-center.black-text.menu-form > div:nth-child(5) > div')
      .assert.containsText('#app > div > div > div > div.container.text-center.black-text.menu-form > div:nth-child(5) > div > div:nth-child(1) > span', validMeal2.name)
      .click('#searchDropdownContainer > div > input[type="text"]')
      .pause(3000)
      .click('#searchDropdownContainer > div > div > div:nth-child(2)')
      .pause(3000)
      .click('#app > div > div > div > div.container.text-center.black-text.menu-form > div:nth-child(4) > input')
      .pause(3000)
      .assert.containsText('#app > div > div > div > div.container.text-center.black-text.menu-form > div:nth-child(5) > div > div:nth-child(2) > span', validMeal2.name)
      .click('#app > div > div > div > div.container.text-center.black-text.menu-form > div:nth-child(5) > div > div:nth-child(2) > input')
      .pause(5000)
      .assert.elementNotPresent('#app > div > div > div > div.container.text-center.black-text.menu-form > div:nth-child(5) > div > div:nth-child(2)')
      .assert.containsText('#app > div > div > div > div.container.text-center.black-text.menu-form > div:nth-child(5) > div > div:nth-child(1) > span', validMeal1.name);
  },
};

import 'babel-polyfill';
import { clearUsers, insertSeedUsers, userJane } from '../../server/utils/seeders/userSeeder';
import { clearMeals, insertSeedMeal, riceAndStew, crispyChicken } from '../../server/utils/seeders/mealSeeder';
import { clearMenus, insertSeedMenu, menuFor23April18, menuFor24April18 } from '../../server/utils/seeders/menuSeeder';

module.exports = {
  before: async (browser) => {
    browser.maximizeWindow();
    await clearUsers();
    await insertSeedUsers(userJane);
    await clearMeals();
    await insertSeedMeal(riceAndStew);
    await insertSeedMeal(crispyChicken);
    await clearMenus();
  },
  after: (browser) => {
    browser.end();
  },
  'A Caterer should be able to create a menu with a meal': function (browser) {
    browser
      .url('http://localhost:3000/users/signin')
      .waitForElementVisible('.signin-content', 1000)
      .setValue('#email', userJane.email)
      .setValue('#password', userJane.password)
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
      .assert.elementPresent('#app > div > div > div > div:nth-child(7) > div > div > div:nth-child(3) > a')
      .pause(3000);
  },
  'A Caterer should be able to view the list of menu': function (browser) {
    browser
      .url('http://localhost:3000/caterer/menus')
      .waitForElementVisible('body', 1000)
      .waitForElementVisible('#app', 1000)
      .assert.containsText('#app > div > div > div > div:nth-child(3) > h1', 'Manage Menus')
      .assert.elementPresent('#app > div > div > div > div:nth-child(3) > div > div > form > input.textbox.datepicker.menu-textbox')
      .assert.elementPresent('#app > div > div > div > div.container.text-center.create-menu > a')
      .assert.elementPresent('#app > div > div > div > div:nth-child(7) > div > div')
      .assert.elementPresent('#app > div > div > div > div:nth-child(7) > div > div')
      .assert.containsText('#app > div > div > div > div:nth-child(7) > div > div > div:nth-child(2) > a', 'Edit')
      .assert.containsText('#app > div > div > div > div:nth-child(7) > div > div > div:nth-child(3) > a', 'View')
      .assert.elementPresent('#app > div > div > div > div:nth-child(7) > ul');
  },
  'A Caterer should be able to view the list of meals in a menu': function (browser) {
    browser
      .url('http://localhost:3000/caterer/menus/view/1')
      .waitForElementVisible('body', 1000)
      .waitForElementVisible('#app', 1000)
      .pause(5000)
      .assert.containsText('#app > div > div > div > div:nth-child(3) > h1', 'View Menu Options')
      .assert.elementPresent('.card-container')
      .assert.elementPresent('.card-img-container')
      .assert.elementPresent('#app > div > div > div > div:nth-child(4) > div > div:nth-child(1) > div.card-img-container > img')
      .assert.elementPresent('#app > div > div > div > div:nth-child(4) > div > div:nth-child(1) > div.card-content')
      .assert.containsText('#app > div > div > div > div:nth-child(4) > div > div:nth-child(1) > div.card-content > div.card-text.black-text > h3', crispyChicken.name)
      .assert.containsText('#app > div > div > div > div:nth-child(4) > div > div:nth-child(1) > div.card-content > div.card-text.black-text > h4', crispyChicken.price)
      .assert.elementPresent('#app > div > div > div > div:nth-child(4) > ul')
      .pause(3000);
  },
  'A Caterer should be able to edit a menu and add more meals': function (browser) {
    browser
      .url('http://localhost:3000/caterer/menus/edit/1')
      .waitForElementVisible('body', 1000)
      .waitForElementVisible('.menu-form', 1000)
      .waitForElementVisible('#app', 3000)
      .assert.elementPresent('#searchDropdownContainer > div > input[type="text"]')
      .assert.elementPresent('#app > div > div > div > div.container.text-center.black-text.menu-form > div:nth-child(4) > input')
      .assert.elementPresent('#app > div > div > div > div.container.text-center.black-text.menu-form > div:nth-child(4) > a')
      .assert.elementPresent('#app > div > div > div > div.container.text-center.black-text.menu-form > div:nth-child(5) > div')
      .assert.containsText('#app > div > div > div > div.container.text-center.black-text.menu-form > div:nth-child(5) > div > div:nth-child(1) > span', crispyChicken.name)
      .click('#searchDropdownContainer > div > input[type="text"]')
      .pause(3000)
      .click('#searchDropdownContainer > div > div > div:nth-child(2)')
      .pause(3000)
      .click('#app > div > div > div > div.container.text-center.black-text.menu-form > div:nth-child(4) > input')
      .pause(3000)
      .assert.containsText('#app > div > div > div > div.container.text-center.black-text.menu-form > div:nth-child(5) > div > div:nth-child(2) > span', crispyChicken.name)
      .click('#app > div > div > div > div.container.text-center.black-text.menu-form > div:nth-child(5) > div > div:nth-child(2) > input')
      .pause(5000)
      .assert.elementNotPresent('#app > div > div > div > div.container.text-center.black-text.menu-form > div:nth-child(5) > div > div:nth-child(2)')
      .assert.containsText('#app > div > div > div > div.container.text-center.black-text.menu-form > div:nth-child(5) > div > div:nth-child(1) > span', riceAndStew.name);
  },
};

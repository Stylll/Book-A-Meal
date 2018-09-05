import 'babel-polyfill';
import { clearUsers, insertSeedUsers, userJane } from '../../server/utils/seeders/userSeeder';
import { clearMeals, insertSeedMeal, riceAndStew } from '../../server/utils/seeders/mealSeeder';

module.exports = {
  before: async (browser) => {
    browser.maximizeWindow();
    await clearUsers();
    await insertSeedUsers(userJane);
    await clearMeals();
  },
  after: (browser) => {
    browser.end();
  },
  'A Caterer should not be able to create a meal with invalid information': function (browser) {
    browser
      .url('http://localhost:3000/users/signin')
      .waitForElementVisible('.signin-content', 1000)
      .setValue('#email', userJane.email)
      .setValue('#password', userJane.password)
      .click('#app > div > div > div > div.signin-overall > div.signin-content > div:nth-child(2) > div:nth-child(7) > input')
      .pause(5000)
      .url('http://localhost:3000/caterer/meals/edit')
      .waitForElementVisible('.meal-form', 1000)
      .click('#app > div > div > div > div.container.text-center.meal-form > div:nth-child(6) > input')
      .pause(5000)
      .assert.containsText('#name-error', 'Meal name is required')
      .assert.containsText('#price-error', 'Price is required')
      .pause(3000)
      .setValue('#price', -1)
      .click('#app > div > div > div > div.container.text-center.meal-form > div:nth-child(6) > input')
      .pause(5000)
      .assert.containsText('#name-error', 'Meal name is required')
      .assert.containsText('#price-error', 'Price is invalid')
      .clearValue('#price')
      .setValue('#price', 0.98)
      .click('#app > div > div > div > div.container.text-center.meal-form > div:nth-child(6) > input')
      .pause(5000)
      .assert.containsText('#name-error', 'Meal name is required')
      .assert.containsText('#price-error', 'Price must be at least 1')
      .pause(3000);
  },
  'A Caterer should be able to create a meal with valid information': function (browser) {
    browser
      .url('http://localhost:3000/caterer/meals/edit')
      .waitForElementVisible('.meal-form', 1000)
      .setValue('#name', 'Rice and Bean')
      .setValue('#price', 1200)
      .click('#app > div > div > div > div.container.text-center.meal-form > div:nth-child(6) > input')
      .pause(5000)
      .assert.containsText('#app > div > div > div > div:nth-child(3) > h1', 'Manage Meals')
      .assert.elementPresent('#app > div > div > div > div:nth-child(4) > div')
      .assert.elementPresent('#app > div > div > div > div:nth-child(4) > div > div')
      .assert.elementPresent('#app > div > div > div > div:nth-child(4) > div > div > div.card-img-container')
      .assert.elementPresent('#app > div > div > div > div:nth-child(4) > div > div > div.card-content')
      .assert.elementPresent('#app > div > div > div > div:nth-child(4) > div > div > div.card-content > div.card-text.black-text > h3')
      .assert.elementPresent('#app > div > div > div > div:nth-child(4) > div > div > div.card-content > div.card-text.black-text > h4')
      .pause(3000);
  },
  'A Caterer should be able to view the list of meals': function (browser) {
    browser
      .url('http://localhost:3000/caterer/meals/')
      .waitForElementVisible('body', 1000)
      .waitForElementVisible('#app', 1000)
      .assert.containsText('#app > div > div > div > div:nth-child(3) > h1', 'Manage Meals')
      .assert.elementPresent('#app > div > div > div > div:nth-child(3) > div > div > form > input.textbox.meal-textbox')
      .assert.elementPresent('#app > div > div > div > div:nth-child(4) > div')
      .assert.elementPresent('#app > div > div > div > div:nth-child(4) > div > div')
      .assert.elementPresent('#app > div > div > div > div:nth-child(4) > div > div > div.card-img-container')
      .assert.elementPresent('#app > div > div > div > div:nth-child(4) > div > div > div.card-content')
      .assert.elementPresent('#app > div > div > div > div:nth-child(4) > div > div > div.card-content > div.card-text.black-text > h3')
      .assert.elementPresent('#app > div > div > div > div:nth-child(4) > div > div > div.card-content > div.card-text.black-text > h4')
      .pause(3000);
  },
  'A Caterer should be able to delete a meal from the list of meals': function (browser) {
    browser
      .url('http://localhost:3000/caterer/meals/')
      .waitForElementVisible('body', 1000)
      .waitForElementVisible('#app', 1000)
      .assert.containsText('#app > div > div > div > div:nth-child(3) > h1', 'Manage Meals')
      .assert.elementPresent('#app > div > div > div > div:nth-child(3) > div > div > form > input.textbox.meal-textbox')
      .assert.elementPresent('#app > div > div > div > div:nth-child(4) > div')
      .assert.elementPresent('#app > div > div > div > div:nth-child(4) > div > div')
      .assert.elementPresent('#app > div > div > div > div:nth-child(4) > div > div > div.card-img-container')
      .click('#app > div > div > div > div:nth-child(4) > div > div > div.card-content > div.card-text.black-text > a.btn.btn-danger')
      .pause(5000)
      .assert.elementPresent('#react-confirm-alert > div > div')
      .assert.containsText('#react-confirm-alert > div > div > div > h1', 'Are you sure?')
      .assert.containsText('#react-confirm-alert > div > div > div > div.row.text-center > button.btn.btn-secondary', 'No, Keep it')
      .assert.containsText('#react-confirm-alert > div > div > div > div.row.text-center > button.btn.btn-danger', 'Yes, Delete it!')
      .click('#react-confirm-alert > div > div > div > div.row.text-center > button.btn.btn-secondary')
      .assert.elementPresent('#app > div > div > div > div:nth-child(4) > div > div > div.card-img-container')
      .click('#app > div > div > div > div:nth-child(4) > div > div > div.card-content > div.card-text.black-text > a.btn.btn-danger')
      .pause(5000)
      .click('#react-confirm-alert > div > div > div > div.row.text-center > button.btn.btn-danger')
      .pause(5000)
      .assert.elementNotPresent('#app > div > div > div > div:nth-child(4) > div > div > div.card-img-container');
  },
};

import 'babel-polyfill';
import { clearUsers, insertSeedUsers, validUser2, validUser1 } from '../../server/utils/seeders/userSeeder';
import { clearMeals, insertSeedMeal, validMeal1, validMeal2 } from '../../server/utils/seeders/mealSeeder';
import { clearMenus, insertSeedMenu, validMenu1, validMenu2, currentMenu } from '../../server/utils/seeders/menuSeeder';
import { clearOrders, insertSeedOrder, validOrder1, validOrder2 } from '../../server/utils/seeders/orderSeeder';

module.exports = {
  before: async (browser) => {
    await clearUsers();
    await insertSeedUsers(validUser2);
    await insertSeedUsers(validUser1);
    await clearMeals();
    await insertSeedMeal(validMeal1);
    await insertSeedMeal(validMeal2);
    await clearMenus();
    await insertSeedMenu(currentMenu);
    await clearOrders();
  },
  after: (browser) => {
    browser.end();
  },
  'Customer should be able to make an order': function (browser) {
    browser
      .url('http://localhost:3000/users/signin')
      .waitForElementVisible('.signin-content', 1000)
      .setValue('#email', validUser1.email)
      .setValue('#password', validUser1.password)
      .click('#app > div > div > div > div.signin-overall > div.signin-content > div:nth-child(2) > div:nth-child(7) > input')
      .pause(5000)
      .url('http://localhost:3000/customer/menu')
      .waitForElementVisible('body', 3000)
      .assert.containsText('#app > div > div > div > div.container.text-center.black-text > div > h1', 'Welcome to Book-A-Meal')
      .assert.containsText('#app > div > div > div > div.container.text-center.black-text > div > h4', 'Your online restaurant to find the finest cuisines.')
      .assert.containsText('#app > div > div > div > div.container.text-center.black-text > div > p', 'Below is a list of our meal options for the day')
      .assert.elementPresent('#app > div > div > div > div:nth-child(4) > div > div:nth-child(1)')
      .assert.elementPresent('#app > div > div > div > div:nth-child(4) > div > div:nth-child(2)')
      .assert.containsText('#app > div > div > div > div:nth-child(4) > div > div:nth-child(1) > div.card-content > div.card-text.black-text > h3', validMeal1.name)
      .assert.containsText('#app > div > div > div > div:nth-child(4) > div > div:nth-child(1) > div.card-content > div.card-text.black-text > h4', validMeal1.price)
      .assert.elementPresent('#app > div > div > div > div:nth-child(4) > div > div:nth-child(1) > div.card-content > div.card-text.black-text > a')
      .assert.elementPresent('.pagination')
      .click('#app > div > div > div > div:nth-child(4) > div > div:nth-child(1) > div.card-content > div.card-text.black-text > a')
      .pause(3000)
      .assert.elementPresent('#app > div > div > div > div:nth-child(3) > div.container.text-center.black-text > div > div.card-content > div > a')
      .click('#app > div > div > div > div:nth-child(3) > div.container.text-center.black-text > div > div.card-content > div > a')
      .pause(3000)
      .click('#app > div > div > div > div:nth-child(4) > div > div:nth-child(1) > div.card-content > div.card-text.black-text > a')
      .pause(3000)
      .assert.containsText('#app > div > div > div > div:nth-child(3) > div:nth-child(1) > h1', 'Confirm your order')
      .assert.elementPresent('.order-form')
      .assert.elementPresent('#app > div > div > div > div:nth-child(3) > div.container.text-center.black-text > div > div.container > img')
      .assert.containsText('#app > div > div > div > div:nth-child(3) > div.container.text-center.black-text > div > div.card-content > div > form > h2', validMeal1.name)
      .assert.containsText('#app > div > div > div > div:nth-child(3) > div.container.text-center.black-text > div > div.card-content > div > form > h4.black-text.normal-text', validMeal1.price)
      .assert.containsText('#app > div > div > div > div:nth-child(3) > div.container.text-center.black-text > div > div.card-content > div > form > h4:nth-child(3)', 'Select Quantity (plates):')
      .setValue('#quantity', 0)
      .click('#app > div > div > div > div:nth-child(3) > div.container.text-center.black-text > div > div.card-content > div > form > input')
      .pause(3000)
      .assert.containsText('#quantity-error', 'Quantity must be greater than zero')
      .setValue('#quantity', 1)
      .assert.containsText('#app > div > div > div > div:nth-child(3) > div.container.text-center.black-text > div > div.card-content > div > form > h3', validMeal1.price)
      .assert.elementPresent('#app > div > div > div > div:nth-child(3) > div.container.text-center.black-text > div > div.card-content > div > form > input')
      .click('#app > div > div > div > div:nth-child(3) > div.container.text-center.black-text > div > div.card-content > div > form > input')
      .pause(5000)
      .assert.elementPresent('#app > div > div > div > div:nth-child(3) > div > h1')
      .assert.elementPresent('#app > div > div > div > div:nth-child(3) > div > div:nth-child(2) > img')
      .assert.containsText('#app > div > div > div > div:nth-child(3) > div > div:nth-child(3) > h1', 'Thank you')
      .assert.containsText('#app > div > div > div > div:nth-child(3) > div > div:nth-child(3) > h3', 'Your order has been received and will be delivered shortly')
      .assert.elementPresent('#app > div > div > div > div:nth-child(3) > div > div:nth-child(3) > a');
  },
  'Customer can view his order history': function (browser) {
    browser
      .url('http://localhost:3000/customer/orders')
      .waitForElementVisible('body', 1000)
      .assert.containsText('#app > div > div > div > div.container.text-center.black-text > h1', 'My Order History')
      .pause(5000)
      .assert.elementPresent('.table-container')
      .assert.containsText('#app > div > div > div > div:nth-child(4) > div > table > tr:nth-child(1) > th:nth-child(2)', 'Order No')
      .assert.containsText('#app > div > div > div > div:nth-child(4) > div > table > tr:nth-child(2) > td.meal-title.wrap-text', validMeal1.name)
      .assert.containsText('#app > div > div > div > div:nth-child(4) > div > table > tr:nth-child(2) > td.price.wrap-text', validMeal1.price)
      .assert.containsText('#app > div > div > div > div:nth-child(4) > div > table > tr:nth-child(2) > td.quantity.wrap-text', 1)
      .assert.containsText('#app > div > div > div > div:nth-child(4) > div > table > tr:nth-child(2) > td.cost.wrap-text', validMeal1.price)
      .assert.containsText('#app > div > div > div > div:nth-child(4) > div > table > tr:nth-child(2) > td.status.wrap-text', 'pending')
      .assert.elementPresent('#app > div > div > div > div:nth-child(4) > div > table > tr:nth-child(2) > td.orderdate.wrap-text')
      .assert.elementPresent('#app > div > div > div > div:nth-child(4) > ul');
  },
  'Customer can edit his pending order': function (browser) {
    browser
      .url('http://localhost:3000/customer/orders/pending')
      .waitForElementVisible('body', 3000)
      .assert.containsText('#app > div > div > div > div.container.text-center.black-text > h1', 'Pending Orders')
      .assert.elementPresent('#app > div > div > div > div:nth-child(4) > div:nth-child(2) > div:nth-child(1) > div.card-content > div > div > a.btn.btn-secondary')
      .assert.containsText('#app > div > div > div > div:nth-child(4) > div > div > div.card-content > div > h4.black-text.light-text.wrap-text', 1)
      .assert.containsText('#app > div > div > div > div:nth-child(4) > div > div > div.card-content > div > h4.black-text.light-text.wrap-text', 3500)
      .click('#app > div > div > div > div:nth-child(4) > div:nth-child(2) > div:nth-child(1) > div.card-content > div > div > a.btn.btn-secondary')
      .pause(3000)
      .waitForElementVisible('body', 3000)
      .assert.elementPresent('.order-form')
      .clearValue('#quantity')
      .setValue('#quantity', 3)
      .click('#app > div > div > div > div:nth-child(3) > div.container.text-center.black-text > div > div.card-content > div > form > input')
      .pause(5000)
      .assert.containsText('#app > div > div > div > div:nth-child(3) > div > div:nth-child(3) > h1', 'Thank you')
      .assert.containsText('#app > div > div > div > div:nth-child(3) > div > div:nth-child(3) > h3', 'Your order has been received and will be delivered shortly')
      .url('http://localhost:3000/customer/orders/pending')
      .waitForElementVisible('body', 5000)
      .pause(5000)
      .assert.containsText('#app > div > div > div > div:nth-child(4) > div > div > div.card-content > div > h4.black-text.light-text.wrap-text', 3)
      .assert.containsText('#app > div > div > div > div:nth-child(4) > div > div > div.card-content > div > h4.black-text.light-text.wrap-text', 3500)
      .assert.containsText('#app > div > div > div > div:nth-child(4) > div > div > div.card-content > div > h4.black-text.light-text.wrap-text', 10500);
  },
  'Customer can cancel a pending order': function (browser) {
    browser
      .url('http://localhost:3000/customer/orders/pending')
      .waitForElementVisible('body', 3000)
      .assert.containsText('#app > div > div > div > div.container.text-center.black-text > h1', 'Pending Orders')
      .assert.elementPresent('#app > div > div > div > div:nth-child(4) > div:nth-child(2) > div:nth-child(1)')
      .assert.elementPresent('#app > div > div > div > div:nth-child(4) > div:nth-child(2) > div:nth-child(1) > div.card-img-container')
      .assert.elementPresent('#app > div > div > div > div:nth-child(4) > div:nth-child(2) > div:nth-child(1) > div.card-img-container')
      .assert.containsText('#app > div > div > div > div:nth-child(4) > div:nth-child(2) > div:nth-child(1) > div.card-content > div > h3', validMeal1.name)
      .assert.containsText('#app > div > div > div > div:nth-child(4) > div:nth-child(2) > div:nth-child(1) > div.card-content > div > h4.black-text.light-text.wrap-text', validMeal1.price)
      .assert.elementPresent('#app > div > div > div > div:nth-child(4) > div:nth-child(2) > div:nth-child(1) > div.card-content > div > div > a.btn.btn-secondary')
      .assert.elementPresent('#app > div > div > div > div:nth-child(4) > div:nth-child(2) > div:nth-child(1) > div.card-content > div > div > a.btn.btn-danger')
      .click('#app > div > div > div > div:nth-child(4) > div:nth-child(2) > div:nth-child(1) > div.card-content > div > div > a.btn.btn-danger')
      .pause(3000)
      .assert.elementPresent('#react-confirm-alert > div > div')
      .assert.containsText('#react-confirm-alert > div > div > div > h1', 'Are you sure?')
      .assert.elementPresent('#react-confirm-alert > div > div > div > div.row.text-center > button.btn.btn-secondary')
      .assert.elementPresent('#react-confirm-alert > div > div > div > div.row.text-center > button.btn.btn-danger')
      .click('#react-confirm-alert > div > div > div > div.row.text-center > button.btn.btn-secondary')
      .assert.containsText('#app > div > div > div > div:nth-child(4) > div:nth-child(2) > div:nth-child(1) > div.card-content > div > h3', validMeal1.name)
      .click('#app > div > div > div > div:nth-child(4) > div:nth-child(2) > div:nth-child(1) > div.card-content > div > div > a.btn.btn-danger')
      .pause(3000)
      .click('#react-confirm-alert > div > div > div > div.row.text-center > button.btn.btn-danger')
      .pause(3000)
      .assert.elementNotPresent('#app > div > div > div > div:nth-child(4) > div:nth-child(2) > div:nth-child(1) > div.card-content > div > h3');
  },
};

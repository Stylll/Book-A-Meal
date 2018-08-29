import 'babel-polyfill';
import { clearUsers, insertSeedUsers, validUser2 } from '../../server/utils/seeders/userSeeder';
import { clearMeals, insertSeedMeal, validMeal1, validMeal2 } from '../../server/utils/seeders/mealSeeder';
import { clearMenus, insertSeedMenu, validMenu1, validMenu2 } from '../../server/utils/seeders/menuSeeder';
import { clearOrders, insertSeedOrder, validOrder1, validOrder2 } from '../../server/utils/seeders/orderSeeder';

module.exports = {
  before: async (browser) => {
    await clearUsers();
    await insertSeedUsers(validUser2);
    await clearMeals();
    await insertSeedMeal(validMeal1);
    await insertSeedMeal(validMeal2);
    await clearMenus();
    await insertSeedMenu(validMenu1);
    await clearOrders();
    await insertSeedOrder(validOrder1);
    await insertSeedOrder({ ...validOrder2, mealId: 2 });
  },
  after: (browser) => {
    browser.end();
  },
  'Caterer can view pending orders': function (browser) {
    browser
      .url('http://localhost:3000/users/signin')
      .waitForElementVisible('.signin-content', 1000)
      .setValue('#email', validUser2.email)
      .setValue('#password', validUser2.password)
      .click('#app > div > div > div > div.signin-overall > div.signin-content > div:nth-child(2) > div:nth-child(7) > input')
      .pause(5000)
      .url('http://localhost:3000/caterer/orders/pending')
      .waitForElementVisible('body', 1000)
      .assert.containsText('#app > div > div > div > div.container.text-center.black-text > h1', 'Pending Orders')
      .assert.elementPresent('#app > div > div > div > div:nth-child(4) > div > div:nth-child(1)')
      .assert.elementPresent('#app > div > div > div > div:nth-child(4) > div > div:nth-child(1) > div.card-img-container')
      .assert.containsText('#app > div > div > div > div:nth-child(4) > div > div:nth-child(1) > div.card-content > div > h3', validMeal2.name)
      .assert.containsText('#app > div > div > div > div:nth-child(4) > div > div:nth-child(1) > div.card-content > div > h4.black-text.light-text.wrap-text', validOrder2.price)
      .assert.elementPresent('#app > div > div > div > div:nth-child(4) > div > div:nth-child(1) > div.card-content > div > div > a.btn.btn-secondary')
      .assert.elementPresent('#app > div > div > div > div:nth-child(4) > div > div:nth-child(1) > div.card-content > div > div > a.btn.btn-danger')
      .assert.containsText('#app > div > div > div > div:nth-child(4) > div > div:nth-child(2) > div.card-content > div > h3', validMeal1.name)
      .assert.containsText('#app > div > div > div > div:nth-child(4) > div > div:nth-child(2) > div.card-content > div > h4.black-text.light-text.wrap-text', validOrder1.price)
      .assert.elementPresent('#app > div > div > div > div:nth-child(4) > div > div:nth-child(2) > div.card-content > div > div > a.btn.btn-secondary')
      .assert.elementPresent('#app > div > div > div > div:nth-child(4) > div > div:nth-child(2) > div.card-content > div > div > a.btn.btn-danger')
      .assert.elementPresent('#app > div > div > div > div:nth-child(4) > ul');
  },
  'Caterer can view all orders': function (browser) {
    browser
      .url('http://localhost:3000/caterer/orders')
      .waitForElementVisible('body', 1000)
      .assert.containsText('#app > div > div > div > div.container.text-center.black-text > h1', 'Customer Order History')
      .pause(5000)
      .assert.elementPresent('.table-container')
      .assert.containsText('#app > div > div > div > div:nth-child(4) > div > table > tr:nth-child(1) > th:nth-child(2)', 'Order No')
      .assert.containsText('#app > div > div > div > div:nth-child(4) > div > table > tr:nth-child(2) > td.meal-title.wrap-text', validMeal2.name)
      .assert.containsText('#app > div > div > div > div:nth-child(4) > div > table > tr:nth-child(3) > td.meal-title.wrap-text', validMeal1.name)
      .assert.containsText('#app > div > div > div > div:nth-child(4) > div > table > tr:nth-child(2) > td.price.wrap-text', validOrder2.price)
      .assert.containsText('#app > div > div > div > div:nth-child(4) > div > table > tr:nth-child(3) > td.price.wrap-text', validOrder1.price)
      .assert.elementPresent('#app > div > div > div > div:nth-child(4) > ul');
  },
  'Caterer can approve orders': function (browser) {
    browser
      .url('http://localhost:3000/caterer/orders/pending')
      .waitForElementVisible('body', 1000)
      .pause(3000)
      .assert.elementPresent('#app > div > div > div > div:nth-child(4) > div > div:nth-child(1) > div.card-content > div > div > a.btn.btn-secondary')
      .click('#app > div > div > div > div:nth-child(4) > div > div:nth-child(1) > div.card-content > div > div > a.btn.btn-secondary')
      .pause(3000)
      .assert.elementPresent('#react-confirm-alert > div > div')
      .assert.containsText('#react-confirm-alert > div > div > div > h1', 'Are you sure?')
      .assert.elementPresent('#react-confirm-alert > div > div > div > div.row.text-center > button.btn.btn-secondary')
      .assert.containsText('#react-confirm-alert > div > div > div > div.row.text-center > button.btn.btn-secondary', 'Yes, approve it!')
      .assert.elementPresent('#react-confirm-alert > div > div > div > div.row.text-center > button.btn.btn-danger')
      .assert.containsText('#react-confirm-alert > div > div > div > div.row.text-center > button.btn.btn-danger', 'No, do nothing')
      .click('#react-confirm-alert > div > div > div > div.row.text-center > button.btn.btn-danger')
      .assert.containsText('#app > div > div > div > div:nth-child(4) > div > div:nth-child(1) > div.card-content > div > h3', validMeal2.name)
      .assert.containsText('#app > div > div > div > div:nth-child(4) > div > div:nth-child(1) > div.card-content > div > h4.black-text.light-text.wrap-text', validOrder2.price)
      .click('#app > div > div > div > div:nth-child(4) > div > div:nth-child(1) > div.card-content > div > div > a.btn.btn-secondary')
      .pause(3000)
      .click('#react-confirm-alert > div > div > div > div.row.text-center > button.btn.btn-secondary')
      .pause(3000)
      .assert.containsText('#app > div > div > div > div:nth-child(4) > div > div:nth-child(1) > div.card-content > div > h3', validMeal1.name)
      .assert.containsText('#app > div > div > div > div:nth-child(4) > div > div:nth-child(1) > div.card-content > div > h4.black-text.light-text.wrap-text', validOrder1.price);
  },
  'Caterer can decline orders': function (browser) {
    browser
      .url('http://localhost:3000/caterer/orders/pending')
      .waitForElementVisible('body', 1000)
      .pause(3000)
      .assert.elementPresent('#app > div > div > div > div:nth-child(4) > div > div:nth-child(1) > div.card-content > div > div > a.btn.btn-secondary')
      .click('#app > div > div > div > div:nth-child(4) > div > div:nth-child(1) > div.card-content > div > div > a.btn.btn-danger')
      .pause(3000)
      .assert.elementPresent('#react-confirm-alert > div > div')
      .assert.containsText('#react-confirm-alert > div > div > div > h1', 'Are you sure?')
      .assert.elementPresent('#react-confirm-alert > div > div > div > div.row.text-center > button.btn.btn-secondary')
      .assert.containsText('#react-confirm-alert > div > div > div > div.row.text-center > button.btn.btn-secondary', 'No, do nothing')
      .assert.elementPresent('#react-confirm-alert > div > div > div > div.row.text-center > button.btn.btn-danger')
      .assert.containsText('#react-confirm-alert > div > div > div > div.row.text-center > button.btn.btn-danger', 'Yes, decline it!')
      .click('#react-confirm-alert > div > div > div > div.row.text-center > button.btn.btn-secondary')
      .assert.containsText('#app > div > div > div > div:nth-child(4) > div > div:nth-child(1) > div.card-content > div > h3', validMeal1.name)
      .assert.containsText('#app > div > div > div > div:nth-child(4) > div > div:nth-child(1) > div.card-content > div > h4.black-text.light-text.wrap-text', validOrder1.price)
      .click('#app > div > div > div > div:nth-child(4) > div > div:nth-child(1) > div.card-content > div > div > a.btn.btn-danger')
      .pause(3000)
      .click('#react-confirm-alert > div > div > div > div.row.text-center > button.btn.btn-danger')
      .pause(3000)
      .assert.elementNotPresent('#app > div > div > div > div:nth-child(4) > div > div:nth-child(1) > div.card-content > div > h3')
      .assert.elementNotPresent('#app > div > div > div > div:nth-child(4) > div > div:nth-child(1) > div.card-content > div > h4.black-text.light-text.wrap-text');
  },
  'Caterer can view order summary': function (browser) {
    browser
      .url('http://localhost:3000/caterer/orders/summary')
      .waitForElementVisible('body', 1000)
      .assert.containsText('#app > div > div > div > div.container.text-center.black-text > h1', 'Customer Order Summary')
      .assert.elementPresent('#summary > div')
      .assert.elementPresent('#summary > div > div')
      .assert.containsText('#summary > div > div > h4:nth-child(2)', 'Total Order: 1')
      .assert.containsText('#summary > div > div > h4:nth-child(3)', `Total Quantity: ${validOrder2.quantity}`)
      .assert.containsText('#summary > div > div > h4:nth-child(4)', `${validOrder2.price * validOrder2.quantity}`)
      .assert.containsText('#summary > div > div > h4:nth-child(5)', 'Total Customer: 1')
      .assert.elementPresent('#summary > div > div > a')
      .assert.elementPresent('.pagination');
  },
};

import 'babel-polyfill';
import { clearUsers, insertSeedUsers, userJane } from '../../server/utils/seeders/userSeeder';
import { clearMeals, insertSeedMeal, riceAndStew, crispyChicken } from '../../server/utils/seeders/mealSeeder';
import { clearMenus, insertSeedMenu, menuFor23April18, menuFor24April18 } from '../../server/utils/seeders/menuSeeder';
import { clearOrders, insertSeedOrder, orderWith1500, orderWith1000 } from '../../server/utils/seeders/orderSeeder';

module.exports = {
  before: async (browser) => {
    browser.maximizeWindow();
    await clearUsers();
    await insertSeedUsers(userJane);
    await clearMeals();
    await insertSeedMeal(riceAndStew);
    await insertSeedMeal(crispyChicken);
    await clearMenus();
    await insertSeedMenu(menuFor23April18);
    await clearOrders();
    await insertSeedOrder(orderWith1500);
    await insertSeedOrder({ ...orderWith1000, mealId: 2 });
  },
  after: (browser) => {
    browser.end();
  },
  'A Caterer should be able to view pending orders': function (browser) {
    browser
      .url('http://localhost:3000/users/signin')
      .waitForElementVisible('.signin-content', 1000)
      .setValue('#email', userJane.email)
      .setValue('#password', userJane.password)
      .click('#app > div > div > div > div.signin-overall > div.signin-content > div:nth-child(2) > div:nth-child(7) > input')
      .pause(5000)
      .url('http://localhost:3000/caterer/orders/pending')
      .waitForElementVisible('body', 1000)
      .waitForElementVisible('#app', 1000)
      .pause(5000)
      .assert.containsText('#app > div > div > div > div.container.text-center.black-text > h1', 'Pending Orders')
      .assert.elementPresent('#app > div > div > div > div:nth-child(4) > div > div:nth-child(1)')
      .assert.elementPresent('#app > div > div > div > div:nth-child(4) > div > div:nth-child(1) > div.card-img-container')
      .assert.containsText('#app > div > div > div > div:nth-child(4) > div > div:nth-child(1) > div.card-content > div > h3', crispyChicken.name)
      .assert.containsText('#app > div > div > div > div:nth-child(4) > div > div:nth-child(1) > div.card-content > div > h4.black-text.light-text.wrap-text', orderWith1000.price)
      .assert.elementPresent('#app > div > div > div > div:nth-child(4) > div > div:nth-child(1) > div.card-content > div > div > a.btn.btn-secondary')
      .assert.elementPresent('#app > div > div > div > div:nth-child(4) > div > div:nth-child(1) > div.card-content > div > div > a.btn.btn-danger')
      .assert.containsText('#app > div > div > div > div:nth-child(4) > div > div:nth-child(2) > div.card-content > div > h3', riceAndStew.name)
      .assert.containsText('#app > div > div > div > div:nth-child(4) > div > div:nth-child(2) > div.card-content > div > h4.black-text.light-text.wrap-text', orderWith1500.price)
      .assert.elementPresent('#app > div > div > div > div:nth-child(4) > div > div:nth-child(2) > div.card-content > div > div > a.btn.btn-secondary')
      .assert.elementPresent('#app > div > div > div > div:nth-child(4) > div > div:nth-child(2) > div.card-content > div > div > a.btn.btn-danger')
      .assert.elementPresent('#app > div > div > div > div:nth-child(4) > ul');
  },
  'A Caterer should be able view all orders': function (browser) {
    browser
      .url('http://localhost:3000/caterer/orders')
      .waitForElementVisible('body', 1000)
      .waitForElementVisible('#app', 1000)
      .assert.containsText('#app > div > div > div > div.container.text-center.black-text > h1', 'Customer Order History')
      .pause(5000)
      .assert.elementPresent('.table-container')
      .assert.containsText('#app > div > div > div > div:nth-child(4) > div > table > tr:nth-child(1) > th:nth-child(2)', 'Order No')
      .assert.containsText('#app > div > div > div > div:nth-child(4) > div > table > tr:nth-child(2) > td.meal-title.wrap-text', crispyChicken.name)
      .assert.containsText('#app > div > div > div > div:nth-child(4) > div > table > tr:nth-child(3) > td.meal-title.wrap-text', riceAndStew.name)
      .assert.containsText('#app > div > div > div > div:nth-child(4) > div > table > tr:nth-child(2) > td.price.wrap-text', orderWith1000.price)
      .assert.containsText('#app > div > div > div > div:nth-child(4) > div > table > tr:nth-child(3) > td.price.wrap-text', orderWith1500.price)
      .assert.elementPresent('#app > div > div > div > div:nth-child(4) > ul');
  },
  'A Caterer should be able approve orders': function (browser) {
    browser
      .url('http://localhost:3000/caterer/orders/pending')
      .waitForElementVisible('body', 1000)
      .waitForElementVisible('#app', 1000)
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
      .assert.containsText('#app > div > div > div > div:nth-child(4) > div > div:nth-child(1) > div.card-content > div > h3', crispyChicken.name)
      .assert.containsText('#app > div > div > div > div:nth-child(4) > div > div:nth-child(1) > div.card-content > div > h4.black-text.light-text.wrap-text', orderWith1000.price)
      .click('#app > div > div > div > div:nth-child(4) > div > div:nth-child(1) > div.card-content > div > div > a.btn.btn-secondary')
      .pause(3000)
      .click('#react-confirm-alert > div > div > div > div.row.text-center > button.btn.btn-secondary')
      .pause(3000)
      .assert.containsText('#app > div > div > div > div:nth-child(4) > div > div:nth-child(1) > div.card-content > div > h3', riceAndStew.name)
      .assert.containsText('#app > div > div > div > div:nth-child(4) > div > div:nth-child(1) > div.card-content > div > h4.black-text.light-text.wrap-text', orderWith1500.price);
  },
  'A Caterer should be able decline orders': function (browser) {
    browser
      .url('http://localhost:3000/caterer/orders/pending')
      .waitForElementVisible('body', 1000)
      .waitForElementVisible('#app', 1000)
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
      .pause(2000)
      .assert.containsText('#app > div > div > div > div:nth-child(4) > div > div:nth-child(1) > div.card-content > div > h3', riceAndStew.name)
      .assert.containsText('#app > div > div > div > div:nth-child(4) > div > div:nth-child(1) > div.card-content > div > h4.black-text.light-text.wrap-text', orderWith1500.price)
      .click('#app > div > div > div > div:nth-child(4) > div > div:nth-child(1) > div.card-content > div > div > a.btn.btn-danger')
      .pause(3000)
      .click('#react-confirm-alert > div > div > div > div.row.text-center > button.btn.btn-danger')
      .pause(3000)
      .assert.elementNotPresent('#app > div > div > div > div:nth-child(4) > div > div:nth-child(1) > div.card-content > div > h3')
      .assert.elementNotPresent('#app > div > div > div > div:nth-child(4) > div > div:nth-child(1) > div.card-content > div > h4.black-text.light-text.wrap-text');
  },
  'A Caterer should be able to view order summary': function (browser) {
    browser
      .url('http://localhost:3000/caterer/orders/summary')
      .waitForElementVisible('body', 1000)
      .waitForElementVisible('#app', 1000)
      .pause(3000)
      .assert.containsText('#app > div > div > div > div.container.text-center.black-text > h1', 'Customer Order Summary')
      .assert.elementPresent('#summary > div')
      .assert.elementPresent('#summary > div > div')
      .assert.containsText('#summary > div > div > h4:nth-child(2)', 'Total Order: 1')
      .assert.containsText('#summary > div > div > h4:nth-child(3)', `Total Quantity: ${orderWith1000.quantity}`)
      .assert.containsText('#summary > div > div > h4:nth-child(4)', `${orderWith1000.price * orderWith1000.quantity}`)
      .assert.containsText('#summary > div > div > h4:nth-child(5)', 'Total Customer: 1')
      .assert.elementPresent('#summary > div > div > a')
      .assert.elementPresent('.pagination');
  },
};

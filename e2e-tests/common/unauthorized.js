import 'babel-polyfill';
import { clearUsers, insertSeedUsers, validUser2, validUser1 } from '../../server/utils/seeders/userSeeder';
import { clearMeals, insertSeedMeal, validMeal1, validMeal2 } from '../../server/utils/seeders/mealSeeder';
import { clearMenus, insertSeedMenu, validMenu1, validMenu2, currentMenu } from '../../server/utils/seeders/menuSeeder';
import { clearOrders, insertSeedOrder, validOrder1, validOrder2 } from '../../server/utils/seeders/orderSeeder';

module.exports = {
  before: async (browser) => {
    await clearUsers();
    await insertSeedUsers(validUser2);
  },
  after: (browser) => {
    browser.end();
  },
  'A user should be redirected to the unauthorized access page when attempting to access an unauthorized route': function (browser) {
    browser
      .url('http://localhost:3000/users/signin')
      .waitForElementVisible('.signin-content', 1000)
      .setValue('#email', validUser2.email)
      .setValue('#password', validUser2.password)
      .click('#app > div > div > div > div.signin-overall > div.signin-content > div:nth-child(2) > div:nth-child(7) > input')
      .pause(5000)
      .url('http://localhost:3000/customer/menu')
      .waitForElementVisible('body', 3000)
      .assert.elementPresent('#app > div > div > div > img')
      .assert.containsText('#app > div > div > div > h3', 'Sorry. You don\'t have access to view the page you requested for')
      .assert.containsText('#app > div > div > div > a', 'Take me home')
      .click('#app > div > div > div > a')
      .pause(5000)
      .waitForElementVisible('body', 3000)
      .assert.containsText('#app > div > div > div > div.main > div > div > h1', 'Book-A-Meal')
      .end();
  },
};

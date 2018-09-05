import 'babel-polyfill';
import { clearUsers, insertSeedUsers, userJane, userMatthew } from '../../server/utils/seeders/userSeeder';
import { clearMeals, insertSeedMeal, riceAndStew, crispyChicken } from '../../server/utils/seeders/mealSeeder';
import { clearMenus, insertSeedMenu, menuFor23April18, menuFor24April18, currentMenu } from '../../server/utils/seeders/menuSeeder';
import { clearOrders, insertSeedOrder, orderWith1500, orderWith1000 } from '../../server/utils/seeders/orderSeeder';

module.exports = {
  before: async (browser) => {
    browser.maximizeWindow();
    await clearUsers();
    await insertSeedUsers(userJane);
  },
  after: (browser) => {
    browser.end();
  },
  'A user should be redirected to the unauthorized access page when attempting to access an unauthorized route': function (browser) {
    browser
      .url('http://localhost:3000/users/signin')
      .waitForElementVisible('.signin-content', 1000)
      .setValue('#email', userJane.email)
      .setValue('#password', userJane.password)
      .click('#app > div > div > div > div.signin-overall > div.signin-content > div:nth-child(2) > div:nth-child(7) > input')
      .pause(5000)
      .url('http://localhost:3000/customer/menu')
      .waitForElementVisible('body', 3000)
      .waitForElementVisible('#app', 3000)
      .assert.elementPresent('#app > div > div > div > img')
      .assert.containsText('#app > div > div > div > h3', 'Sorry. You don\'t have access to view the page you requested for')
      .assert.containsText('#app > div > div > div > a', 'Take me home')
      .pause(5000)
      .end();
  },
};

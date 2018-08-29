import 'babel-polyfill';
import { clearUsers, insertSeedUsers, validUser1 } from '../../server/utils/seeders/userSeeder';

module.exports = {
  before: async (browser) => {
    await clearUsers();
    await insertSeedUsers(validUser1);
  },
  'User cannot signup with invalid information': function (browser) {
    browser
      .url('http://localhost:3000')
      .waitForElementVisible('body', 1000)
      .click('#app > div > div > div > div:nth-child(2) > div > nav > div:nth-child(3) > a')
      .waitForElementVisible('.signup-content', 1000)
      .setValue('#username', 'stephen')
      .setValue('#email', 'step')
      .setValue('#password', '1234567890')
      .setValue('#confirmPassword', '123456789')
      .click('#app > div > div > div > div.overall > div.signup-content > div:nth-child(2) > div:nth-child(8) > input')
      .pause(5000)
      .assert.containsText('#email-error', 'Email is invalid')
      .assert.containsText('#password-error', 'Passwords dont match')
      .assert.containsText('#confirmPassword-error', 'Passwords dont match');
  },
  'User can signup with valid information': function (browser) {
    browser
      .url('http://localhost:3000')
      .waitForElementVisible('body', 1000)
      .click('#app > div > div > div > div:nth-child(2) > div > nav > div:nth-child(3) > a')
      .waitForElementVisible('.signup-content', 1000)
      .setValue('#username', 'stephen')
      .setValue('#email', 'step@yahoo.com')
      .setValue('#password', '1234567890')
      .setValue('#confirmPassword', '1234567890')
      .click('#app > div > div > div > div.overall > div.signup-content > div:nth-child(2) > div:nth-child(8) > input')
      .pause(5000)
      .assert.containsText('#app > div > div > div > div.container.text-center.black-text > h1', 'My Order History')
      .end();
  },
};

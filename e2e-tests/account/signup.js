import 'babel-polyfill';
import { clearUsers, insertSeedUsers, userMatthew } from '../../server/utils/seeders/userSeeder';

module.exports = {
  before: async (browser) => {
    browser.maximizeWindow();
    await clearUsers();
    await insertSeedUsers(userMatthew);
  },
  'A User should not be able to signup with invalid information': function (browser) {
    browser
      .url('http://localhost:3000')
      .waitForElementVisible('body', 1000)
      .waitForElementVisible('#app', 1000)
      .click('#app > div > div > div > div:nth-child(2) > div > nav > div:nth-child(3) > a')
      .waitForElementVisible('.signup-content', 1000)
      .click('#app > div > div > div > div.overall > div.signup-content > div:nth-child(2) > div:nth-child(8) > input')
      .pause(5000)
      .assert.containsText('#username-error', 'Username is required')
      .assert.containsText('#email-error', 'Email is required')
      .assert.containsText('#password-error', 'Password is required')
      .setValue('#password', 'abcd')
      .click('#app > div > div > div > div.overall > div.signup-content > div:nth-child(2) > div:nth-child(8) > input')
      .pause(5000)
      .assert.containsText('#password-error', 'Password must have atleast 6 characters')
      .setValue('#username', 'stephen')
      .setValue('#email', 'step')
      .setValue('#password', '1234567890')
      .setValue('#confirmPassword', '123456789')
      .click('#app > div > div > div > div.overall > div.signup-content > div:nth-child(2) > div:nth-child(8) > input')
      .pause(5000)
      .assert.containsText('#email-error', 'Email is invalid')
      .assert.containsText('#password-error', 'Passwords dont match')
      .assert.containsText('#confirmPassword-error', 'Passwords dont match')
      .url('localhost:3000/users/signup')
      .waitForElementVisible('body', 1000)
      .waitForElementVisible('#app', 1000)
      .setValue('#username', userMatthew.username)
      .setValue('#email', userMatthew.email)
      .setValue('#password', '1234567890')
      .setValue('#confirmPassword', '1234567890')
      .click('#app > div > div > div > div.overall > div.signup-content > div:nth-child(2) > div:nth-child(8) > input')
      .pause(5000)
      .assert.containsText('#username-error', 'Username already exists. Try another one.')
      .assert.containsText('#email-error', 'Email already exists. Try another one.');
  },
  'A User should be able to signup with valid information': function (browser) {
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
      .assert.containsText('#app > div > div > div > div.container.text-center.black-text > div > h1', 'Welcome to Book-A-Meal')
      .assert.containsText('#app > div > div > div > div.container.text-center.black-text > div > h4', 'Your online restaurant to find the finest cuisines.')
      .assert.containsText('#app > div > div > div > div.container.text-center.black-text > div > p', 'Below is a list of our meal options for the day')
      .end();
  },
};

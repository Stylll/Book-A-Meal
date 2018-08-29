import 'babel-polyfill';
import { clearUsers, insertSeedUsers, validUser1 } from '../../server/utils/seeders/userSeeder';


module.exports = {
  before: async (browser) => {
    await clearUsers();
    await insertSeedUsers(validUser1);
  },
  'User cannot signin with invalid information': function (browser) {
    browser
      .url('http://localhost:3000')
      .waitForElementVisible('body', 1000)
      .click('#app > div > div > div > div:nth-child(2) > div > nav > div:nth-child(2) > a')
      .waitForElementVisible('.signin-content', 1000)
      .setValue('#email', 'step')
      .setValue('#password', '1234567890')
      .click('#app > div > div > div > div.signin-overall > div.signin-content > div:nth-child(2) > div:nth-child(7) > input')
      .pause(5000)
      .assert.containsText('#email-error', 'Email is invalid');
  },
  'User can signin with valid information': function (browser) {
    browser
      .url('http://localhost:3000')
      .waitForElementVisible('body', 1000)
      .click('#app > div > div > div > div:nth-child(2) > div > nav > div:nth-child(2) > a')
      .waitForElementVisible('.signin-content', 1000)
      .setValue('#email', 'matthew@yahoo.com')
      .setValue('#password', 'Mat1234')
      .click('#app > div > div > div > div.signin-overall > div.signin-content > div:nth-child(2) > div:nth-child(7) > input')
      .pause(5000)
      .assert.containsText('#app > div > div > div > div.container.text-center.black-text > div > h1', 'Welcome to Book-A-Meal')
      .assert.containsText('#app > div > div > div > div.container.text-center.black-text > div > h4', 'Your online restaurant to find the finest cuisines.')
      .assert.containsText('#app > div > div > div > div.container.text-center.black-text > div > p', 'Below is a list of our meal options for the day')
      .end();
  },
};

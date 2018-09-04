import 'babel-polyfill';

module.exports = {
  'A user should be redirected to a not found page when attempting to access a route that does not exist ': function (browser) {
    browser
      .url('http://localhost:3000/stark-enterprise')
      .waitForElementVisible('body', 3000)
      .assert.elementPresent('#app > div > div > div > img')
      .assert.containsText('#app > div > div > div > h3', 'Sorry. it seems you\'re trying to get a dish that does not exist')
      .assert.containsText('#app > div > div > div > a', 'Take me home')
      .click('#app > div > div > div > a')
      .pause(5000)
      .waitForElementVisible('body', 3000)
      .assert.containsText('#app > div > div > div > div.main > div > div > h1', 'Book-A-Meal')
      .end();
  },
};

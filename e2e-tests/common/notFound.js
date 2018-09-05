import 'babel-polyfill';

module.exports = {
  'A user should be redirected to a not found page when attempting to access a route that does not exist ': function (browser) {
    browser
      .maximizeWindow()
      .url('http://localhost:3000/stark-enterprise')
      .waitForElementVisible('body', 3000)
      .waitForElementVisible('#app', 3000)
      .assert.elementPresent('#app > div > div > div > img')
      .assert.containsText('#app > div > div > div > h3', 'Sorry. it seems you\'re trying to get a dish that does not exist')
      .assert.containsText('#app > div > div > div > a', 'Take me home')
      .pause(5000)
      .end();
  },
};

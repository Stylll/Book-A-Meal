import 'babel-polyfill';

module.exports = {
  'Landing page should display expected information': function (browser) {
    browser
      .url('http://localhost:3000')
      .waitForElementVisible('body', 3000)
      .assert.containsText('#app > div > div > div > div.main > div > div > h1', 'Book-A-Meal')
      .assert.containsText('#app > div > div > div > div.main > div > div > p', 'Your online restaurant to find the finest cuisines')
      .assert.containsText('#app > div > div > div > div.main > div > div > h3:nth-child(3)', 'BAM is an application where customers can make food orders and caterers can know what a customer whats to eat')
      .assert.containsText('#app > div > div > div > div.main > div > div > h3:nth-child(4)', 'We create a platform for customers to enjoy classy and tasty meals while leveraging the finesse of our world class caterers who are masters of their craft')
      .assert.containsText('#app > div > div > div > div.main > div > div > h3:nth-child(5)', 'Click here to join and become our customer or caterer')
      .assert.containsText('#app > div > div > div > div.main > div > div > h3:nth-child(6)', 'You can sign in here if you are already one of us')
      .end();
  },
};

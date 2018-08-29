module.exports = {
  baseURL: 'https://selenium-release.storage.googleapis.com',
  version: '3.9.1',
  basePath: './.bin/.selenium',
  drivers: {
    chrome: {
      version: '2.41',
      arch: process.arch,
      baseURL: 'https://chromedriver.storage.googleapis.com',
    },
    firefox: {
      version: '0.21.0',
      arch: process.arch,
      baseURL: 'https://github.com/mozilla/geckodriver/releases/download',
    },
  },
};

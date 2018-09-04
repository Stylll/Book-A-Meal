/* eslint-disable no-unused-vars */
import fs from 'fs';
import cheerio from 'cheerio';
import colors from 'colors';

/* eslint-disable no-console */

fs.readFile('client/src/index.html', 'utf8', (error, markup) => {
  if (error) {
    return console.log(error);
  }

  const $ = cheerio.load(markup);

  // dynamically prepend the style ref to the head
  $('head').prepend('<link rel="stylesheet" href="/style.css"/>');

  fs.writeFile('client/dist/index.html', $.html(), 'utf8', (error) => {
    if (error) {
      return console.log(error);
    }
    console.log('index.html created in /client/dist'.green);
  });
});

/* eslint-disable no-unused-vars */
import fs from 'fs';
import cheerio from 'cheerio';
import colors from 'colors';

/* eslint-disable no-console */

fs.readFile('client/src/index.html', 'utf8', (err, markup) => {
  if (err) {
    return console.log(err);
  }

  const $ = cheerio.load(markup);

  // dynamically prepend the style ref to the head
  $('head').prepend('<link rel="stylesheet" href="style.css"/>');

  fs.writeFile('client/dist/index.html', $.html(), 'utf8', (err) => {
    if (err) {
      return console.log(err);
    }
    console.log('index.html created in /client/dist'.green);
  });
});

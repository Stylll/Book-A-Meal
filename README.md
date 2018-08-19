# Book-A-Meal - https://bookamealapp.herokuapp.com/
[![Build Status](https://travis-ci.org/Stylll/Book-A-Meal.svg?branch=develop)](https://travis-ci.org/Stylll/Book-A-Meal)
[![Coverage Status](https://coveralls.io/repos/github/Stylll/Book-A-Meal/badge.svg?branch=develop)](https://coveralls.io/github/Stylll/Book-A-Meal?branch=develop)
[![Maintainability](https://api.codeclimate.com/v1/badges/9037bcf71b13532947cd/maintainability)](https://codeclimate.com/github/Stylll/Book-A-Meal/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/9037bcf71b13532947cd/test_coverage)](https://codeclimate.com/github/Stylll/Book-A-Meal/test_coverage)

Book-A-Meal is an application that allows customers to make food orders and helps the food vendor know what the customers what to eat.

BAM has 2 categories of users. The customer and the caterer.

Application hosted on https://bookamealapp.herokuapp.com/

## Features
* Authentication is done using **Json Web Token**. This ensure the api endpoints are secured. 
* The features are categorized below according to the profiles they belong to.

### Customer Profile
* A customer can view the menu for the day set by the caterer in order to order for a meal.
* A customer can create an order from the meals present in the menu.
* A customer has a dashboard which displays the list of pending orders and the order history.
* A customer gets notified via email when the menu for the day is set.

### Caterer Profile
* A caterer can create the menu for the day and can add / remove his meals from the menu. 
* A caterer can create various meals he / she can prepare for the customers.
* A caterer can approve a meal order created by a customer.
* A caterer has a dashboard to view the analytics of his/her orders per day.
* A caterer can also view the details of an order made by a customer.


## UI Template
To view the template design, follow the link below:

https://stylll.github.io/Book-A-Meal/UI/index.html

## API Documentation
The full API documentation can be found by following the link below:

https://bookamealapp.herokuapp.com/api-docs

## Pivotal Tracker
Project is managed using pivotal tracker management tool. You can view the board with the link below:

https://www.pivotaltracker.com/n/projects/2165495

# Getting Started
**Via Cloning The Repository**
```
# Clone the app
git clone https://github.com/stylll/Book-A-Meal.git

# Switch to directory
cd Book-A-Meal

# Create .env file in the root directory
touch .env
update env file with required information

# Install Package dependencies
npm install

# Install Sequelize globally
npm install sequelize-cli
run sequelize migrate:db to migrate the database

#Start the application
npm run start:app
```

## Testing
* Server side tests - Run `npm run test:server`
* Client side tests - Run `npm run test:client`

## Built with
* [NodeJS](https://nodejs.org/en/) - A Javascript runtime built runtime that uses an event-driven non-blocking I/O model that makes it lightweight and efficient.
* [ExpressJS](http://expressjs.com/) - A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. This is used in this application for routing to endpoints.
* [NPM](https://www.npmjs.com/) - A Node Package Dependency Manager
* [ReactJs](https://reactjs.org/) - A Javascript library for building user interfaces
* [Redux](https://redux.js.org/) - Redux is a predictable state container for JavaScript apps.
* [Webpack](https://babeljs.io/) - Webpack is a static module bundler for modern JavaScript applications
* [PGSQL](https://www.postgresql.org/) - Opened source relational database
* [Sequelize](http://docs.sequelizejs.com/) - Promise-based ORM for Node.js
* [Axios](https://github.com/axios/axios) - Promise based HTTP client for the browser and node.js

#### Test Tools

* [Mocha](https://mochajs.org/) - JavaScript Test Framework for API Tests
* [Chai](http://chaijs.com/) - TDD/BDD Assertion Library for Node
* [Supertest](https://github.com/visionmedia/supertest) - Super-agent driven
  library for testing node.js HTTP servers
* [Istanbul(nyc)](https://istanbul.js.org/) - Code Coverage Generator
* [Jest](https://jestjs.io/) - Delightful JavaScript Testing
* [Enzyme](http://airbnb.io/enzyme/) - Enzyme is a JavaScript Testing utility for React that makes it easier to assert, manipulate, and traverse your React Components' output.
* [Moxios](https://github.com/axios/moxios) - Moxios is a package for mocking axios requests for testing

#### Linter(s)

* [ESLint](https://eslint.org/) - Linter Tool

#### Compiler

* [Babel](https://eslint.org/) - Compiler for Next Generation JavaScript

## Contributing
Book-A-Meal is open source and contributions are highly welcomed.

If you are interested in contributing, follow the instructions below.

* Fork the repository

* Create a new branch

* Make your changes and commit them

* Provide a detailed commit description

* Raise a pull request against Develop

`Ensure your codes follow the` [AirBnB Javascript Styles Guide](https://github.com/airbnb/javascript)

`See project wiki for commit message, pull request and branch naming conventions.`

`All Pull requests must be made against Develop branch. PRs against master would be rejected.`

## FAQ

* Who can contribute ?
  - This is an open source project. Contributions are welcome from everyone.

* Was any management tool used ?
  - Yes. Pivotal tracker was used. Refer to the Pivotal Tracker section above to get the link.

* Who maintains Book-A-Meal ?
  - I currently maintain the application. Reach out to me via email on `stephen.aribaba@gmail.com` if 
  you will like to maintain the app.

* Does the application have an API ?
  - Yes. The api documentation can be found in the link provided in the API Documentation section above.

## License and Copyright

&copy; Stephen Aribaba

Licensed under the [MIT License](https://opensource.org/licenses/MIT).


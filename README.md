# Book-A-Meal
[![Build Status](https://travis-ci.org/Stylll/Book-A-Meal.svg?branch=develop)](https://travis-ci.org/Stylll/Book-A-Meal)
[![Coverage Status](https://coveralls.io/repos/github/Stylll/Book-A-Meal/badge.svg?branch=develop)](https://coveralls.io/github/Stylll/Book-A-Meal?branch=develop)
[![Maintainability](https://api.codeclimate.com/v1/badges/9037bcf71b13532947cd/maintainability)](https://codeclimate.com/github/Stylll/Book-A-Meal/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/9037bcf71b13532947cd/test_coverage)](https://codeclimate.com/github/Stylll/Book-A-Meal/test_coverage)

Book-A-Meal is an application that allows customers to make food orders and helps the food vendor know what the customers what to eat.

BAM has 2 categories of users. The customer and the caterer.

## Features
* Authentication is done using **Json Web Token**. This ensure the api endpoints are secured. 

### Customers
* View Menu
* Order Meal
* View Pending Order
* View Order History

### Caterers
* Create Menu
* Create Meal
* Approve Order
* View Order Summary
* View Order Details

### Users
* Create Account
* View Profile
* Reset Password

## Built with
* [NodeJS](https://nodejs.org/en/) - A Javascript runtime built runtime that uses an event-driven non-blocking I/O model that makes it lightweight and efficient.
* [ExpressJS](http://expressjs.com/) - A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. This is used in this application for routing to endpoints.
* [NPM](https://www.npmjs.com/) - A Node Package Dependency Manager

#### Test Tools

* [Mocha](https://mochajs.org/) - JavaScript Test Framework for API Tests
* [Chai](http://chaijs.com/) - TDD/BDD Assertion Library for Node
* [Supertest](https://github.com/visionmedia/supertest) - Super-agent driven
  library for testing node.js HTTP servers
* [Istanbul(nyc)](https://istanbul.js.org/) - Code Coverage Generator

#### Linter(s)

* [ESLint](https://eslint.org/) - Linter Tool

#### Compiler

* [Babel](https://eslint.org/) - Compiler for Next Generation JavaScript

## Pivotal Tracker
Project is managed using pivotal tracker management tool. You can view the template with the link below:

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

# Install Package dependencies
npm install

#Start the application (server)
npm run start
```

## Testing
* Server side tests - Run `npm run test:server`


## UI Template
To view the template design, follow the link below:

https://stylll.github.io/Book-A-Meal/UI/index.html

## API Documentation
https://bookamealapp.herokuapp.com/api-docs

## Frontend
https://bookamealapp.herokuapp.com/

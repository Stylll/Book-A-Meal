import bcrypt from 'bcrypt';

export default {
  up: queryInterface => queryInterface.bulkInsert('Users', [{
    email: 'stephen.aribaba@gmail.com',
    username: 'Stephen',
    password: bcrypt.hashSync('stephen', 10),
    accountType: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
  }], {}),

  down: queryInterface => queryInterface.bulkDelete('Users', [{
    email: 'stephen.aribaba@gmail.com',
  }], {}),
};

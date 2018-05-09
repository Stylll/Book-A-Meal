export default {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      email: 'stephen.aribaba@gmail.com',
      username: 'Stephen',
      password: 'stephen',
      accountType: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', [{
      email: 'stephen.aribaba@gmail.com',
    }], {});
  },
};

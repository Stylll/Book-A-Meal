module.exports = {
  up: (queryInterface, Sequelize) => (
    queryInterface.addColumn(
      'Meals',
      'deletedAt',
      Sequelize.DATE,
    )
  ),

  down: (queryInterface, Sequelize) => (
    queryInterface.removeColumn('Meals', 'deletedAt')
  ),
};

export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('MenuMeals', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    menuId: {
      allowNull: true,
      type: Sequelize.INTEGER,
      references: {
        model: 'Menus',
        key: 'id',
        as: 'menuId',
      },
    },
    mealId: {
      allowNull: true,
      type: Sequelize.INTEGER,
      references: {
        model: 'Meals',
        key: 'id',
        as: 'mealId',
      },
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: queryInterface => queryInterface.dropTable('MenuMeals'),
};

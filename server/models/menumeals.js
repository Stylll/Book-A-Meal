export default (sequelize, DataTypes) => {
  const MenuMeals = sequelize.define('MenuMeals', {
    menuId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Menus',
        key: 'menuId',
        as: 'menuId',
      },
    },
    mealId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Meals',
        key: 'mealId',
        as: 'mealId',
      },
    },
  }, {});
  return MenuMeals;
};

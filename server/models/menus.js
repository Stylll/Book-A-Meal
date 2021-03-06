import { beautifyDate } from '../utils/dateBeautifier';

export default (sequelize, DataTypes) => {
  const Menus = sequelize.define('Menus', {
    name: {
      type: DataTypes.STRING,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Menu date already exists',
      },
    },
    mealIds: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: {
        args: false,
        msg: 'Meal Ids are required',
      },
    },
  }, {
    hooks: {
      beforeCreate: (menu) => {
        menu.setName();
      },
      beforeUpdate: (menu) => {
        if (menu.changed('date')) {
          menu.setName();
        }
      },
      beforeBulkCreate: (menus) => {
        menus.forEach((menu) => {
          menu.setName();
        });
      },
      beforeBulkUpdate: (menus) => {
        menus.forEach((menu) => {
          if (menu.changed('date')) {
            menu.setName();
          }
        });
      },
    },
  });
  Menus.associate = (models) => {
    // associations can be defined here
    Menus.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
    Menus.belongsToMany(models.Meals, {
      through: models.MenuMeals,
      as: 'meals',
      foreignKey: 'menuId',
    });
  };
  // Instance Method
  Menus.prototype.setName = function setName() {
    this.name = `Menu For ${beautifyDate(this.date)}`;
  };

  return Menus;
};

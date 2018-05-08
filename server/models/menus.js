import { beautifyDate } from '../utils/dateBeautifier';

export default (sequelize, DataTypes) => {
  const Menus = sequelize.define('Menus', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
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
      type: DataTypes.ARRAY(DataTypes.TEXT),
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
  };
  // Instance Method
  Menus.prototype.setName = function setName() {
    this.name = `Menu For ${beautifyDate(this.date)}`;
  };

  return Menus;
};

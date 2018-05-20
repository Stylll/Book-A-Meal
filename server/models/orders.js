export default (sequelize, DataTypes) => {
  const Orders = sequelize.define('Orders', {
    price: {
      type: DataTypes.INTEGER,
      allowNulls: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNulls: false,
    },
    cost: {
      type: DataTypes.FLOAT,
    },
    status: {
      type: DataTypes.STRING,
    },
  }, {});
  Orders.associate = (models) => {
    // associations can be defined here
    Orders.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });

    Orders.belongsTo(models.Meals, {
      foreignKey: 'mealId',
    });
  };
  return Orders;
};

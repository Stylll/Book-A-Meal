export default (sequelize, DataTypes) => {
  const Meals = sequelize.define('Meals', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Meal name already exists',
      },
      validate: {
        notEmpty: {
          args: true,
          msg: 'Meal name is required',
        },
      },
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Image link is required',
        },
      },
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Price is required',
        },
      },
    },
  }, {});
  Meals.associate = (models) => {
    // associations can be defined here
    Meals.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
  };
  return Meals;
};

import bcrypt from 'bcrypt';

export default (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Email exists',
      },
      validate: {
        isEmail: {
          args: true,
          msg: 'Email is invalid',
        },
        notEmpty: {
          args: true,
          msg: 'Email is required',
        },
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Username exists',
      },
      validate: {
        notEmpty: {
          args: true,
          msg: 'Username is required',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Password is required',
        },
        min: {
          args: 5,
          msg: 'Password must have atleast 5 characters',
        },
      },
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    hooks: {
      beforeCreate: (user) => {
        user.hashPassword();
      },
      beforeUpdate: (user) => {
        if (user.changed('password')) {
          user.hashPassword();
        }
      },
      beforeBulkCreate: (users) => {
        users.forEach((user) => {
          user.hashPassword();
        });
      },
      beforeBulkUpdate: (users) => {
        users.forEach((user) => {
          if (user.changed('password')) {
            user.hashPassword();
          }
        });
      },
    },
  });
  Users.associate = (models) => {
    // associations can be defined here
  };

  // Instance Method
  Users.prototype.hashPassword = function hashPassword() {
    this.password = bcrypt.hashSync(this.password, 10);
  };
  return Users;
};

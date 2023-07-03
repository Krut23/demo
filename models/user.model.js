const { DataTypes } = require('sequelize');

module.exports = function (sequelize) {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  User.prototype.isAuthenticated = function (password) {
    return bcrypt.compare(password, this.password);
  };

  return User;
};

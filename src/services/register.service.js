const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = function (app) {
  const userModel = app.get('models').userModel;

  return {
    async create(data) {
      const { username, password } = data;

      // Check if username already exists
      const existingUser = await userModel.findOne({ where: { username } });
      if (existingUser) {
        throw new Error('Username already exists');
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the user
      const user = await userModel.create({ username, password: hashedPassword });
      return user;
    },
  };
};

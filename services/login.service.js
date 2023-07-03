const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = function (app) {
  const userModel = app.get('models').userModel;

  return {
    async create(data) {
      const { username, password } = data;

      // Check if the username exists in the database
      const user = await userModel.findOne({ where: { username } });
      if (!user) {
        throw new Error('Invalid username or password');
      }

      // Compare the provided password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid username or password');
      }

      // Generate a JSON Web Token (JWT)
      const token = jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '1h' });

      return { token };
    },
  };
};

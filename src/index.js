const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const database = require('./config/database');
const { Sequelize } = require('sequelize');

// Create an Express compatible Feathers application instance
const app = express(feathers());

// Set up middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.configure(express.rest());

// Database connection
const sequelize = database;

sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection established successfully');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

// Import the user model
const userModel = require('./models/user.model')(sequelize, Sequelize);

// Sync the models with the database
sequelize.sync()
  .then(() => {
    console.log('Models synchronized with the database');
  })
  .catch((err) => {
    console.error('Unable to sync models with the database:', err);
  });

// Register the user model with the Feathers application
app.set('sequelizeClient', sequelize);
app.set('models', {
  userModel
});

// Register the register service
const registerService = require('./services/register.service');
app.use('/register', registerService(app));

// Import the login service
const loginService = require('./services/login.service');
app.use('/login', loginService(app));

// Start the server
app.listen(3000, () => {
  console.log('Feathers server listening on port 3000');
});

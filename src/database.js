const { Sequelize } = require('sequelize');
const dotenv= require('dotenv');

dotenv.config({ path: './config.env' });

const sequelize = new Sequelize(
  `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`,
  { 
    dialect: 'postgres',
    logging: false,
  }
);


module.exports = sequelize;

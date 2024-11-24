const { Sequelize } = require("sequelize");
require("dotenv").config();

const dbHost = process.env.PORTFOLIO_HOST;
const dbName = process.env.PORTFOLIO_DB;
const dbUser = process.env.PORTFOLIO_USER;
const dbPassword = process.env.PORTFOLIO_PASSWORD;

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  dialect: "mssql",
  host: dbHost,
});

module.exports = sequelize;

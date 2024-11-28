const { Sequelize } = require("sequelize");
require("dotenv").config();

// Configuração para localhost
const sequelize = new Sequelize('your_database', 'your_user', 'your_password', {
  dialect: "mssql",
  host: "localhost",
  // Configurações adicionais para conexão local
  options: {
    trustServerCertificate: true, // Necessário para conexões locais no MSSQL
  }
});

module.exports = sequelize;

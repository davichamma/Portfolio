const { DataTypes } = require("sequelize");
const db = require("../db");

module.exports = db.define(
  "cnaes",
  {
    codigo: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    texto: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

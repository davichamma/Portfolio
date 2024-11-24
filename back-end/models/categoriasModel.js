const { DataTypes } = require("sequelize");
const db = require("../db");

const Categorias = db.define(
  "categorias",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    linhaNegocioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    categoria: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    corFonte: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    corFundo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Categorias;

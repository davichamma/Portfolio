const { DataTypes } = require("sequelize");
const db = require("../db");
const EmpresasRepository = require("./empresasModel");

module.exports = db.define(
  "socios",
  {
    cnpj: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: EmpresasRepository,
        key: "cnpj",
      },
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    qual: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

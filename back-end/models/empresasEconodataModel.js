const { DataTypes } = require("sequelize");
const db = require("../db");
const EmpresasRepository = require("./empresasModel");

module.exports = db.define(
  "empresasEconodata",
  {
    cnpj: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    codigoCnae: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    qtdFuncionariosAteMacro: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    qtdFuncionariosDeMacro: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    faturamentoAteMacro: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    faturamentoDeMacro: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    valorFaturamento: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    porte: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

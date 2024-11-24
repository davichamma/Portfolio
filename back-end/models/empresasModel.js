const { DataTypes } = require("sequelize");
const db = require("../db");
const CnaesRepository = require("./cnaesModel");

module.exports = db.define(
  "empresas",
  {
    cnpj: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    abertura: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fantasia: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    capitalSocial: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    porte: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    naturezaJuridica: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    codigoCnae: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: CnaesRepository,
        key: "codigo",
      },
    },
    atualizacao: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

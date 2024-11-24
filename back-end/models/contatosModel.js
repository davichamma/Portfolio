const { DataTypes } = require("sequelize");
const db = require("../db");
const EmpresasRepository = require("./empresasModel");

module.exports = db.define(
  "contatos",
  {
    cnpj: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: EmpresasRepository,
        key: "cnpj",
      },
    },
    municipio: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bairro: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    logradouro: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    numero: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    complemento: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cep: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    telefone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

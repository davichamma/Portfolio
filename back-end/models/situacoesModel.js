const { DataTypes } = require("sequelize");
const db = require("../db");
const EmpresasRepository = require("./empresasModel");

module.exports = db.define(
  "situacoes",
  {
    cnpj: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: EmpresasRepository,
        key: "cnpj",
      },
    },
    tipoSituacao: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    motivoSituacao: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dataSituacao: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

const { DataTypes } = require("sequelize");
const db = require("../db");
const CnaesRepository = require("./cnaesModel");
const EmpresasRepository = require("./empresasModel");

module.exports = db.define(
  "cnaesSecundarios",
  {
    cnpj: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: EmpresasRepository,
        key: "cnpj",
      },
    },
    codigo: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: CnaesRepository,
        key: "codigo",
      },
    },
  },
  {
    timestamps: false,
  }
);

const { DataTypes } = require("sequelize");
const db = require("../db");

const ProdutosCRM = db.define(
  "crmProdutos",
  {
    produtoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    codErp: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    codCrm: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    descricao: {
      type: DataTypes.STRING(4000),
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = ProdutosCRM;

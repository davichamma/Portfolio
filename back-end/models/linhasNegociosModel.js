const { DataTypes } = require("sequelize");
const db = require("../db");
const Categorias = require("./categoriasModel");

const LinhasNegocios = db.define(
  "linhasNegocios",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    linhaNegocio: {
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

LinhasNegocios.hasMany(Categorias, {
  foreignKey: "linhaNegocioId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
Categorias.belongsTo(LinhasNegocios, {
  foreignKey: "linhaNegocioId",
  targetKey: "id",
});

module.exports = LinhasNegocios;

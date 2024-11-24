const { DataTypes } = require("sequelize");
const db = require("../db");
const Ods = require("./odsModel");
const Arquivos = require("./arquivosModel");
const Links = require("./linksModel");
const CrmProdutos = require("./produtosPortfolioModel");
const Favoritos = require("./favoritosModel");

const Produtos = db.define("produtos", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  produto: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  linhaNegocio: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  categoria: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  familia: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  subsidio: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  entregaveis: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  prazoEntrega: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  descricao: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  funcionamento: {
    type: DataTypes.STRING(1000),
    allowNull: true,
  },
  publicoAlvo: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  lei: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  horas: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  beneficios: {
    type: DataTypes.STRING(1000),
    allowNull: true,
  },
  modalidade: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

// Defining the associations
Produtos.hasMany(Ods, {
  foreignKey: "produtoId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
Ods.belongsTo(Produtos, {
  foreignKey: "produtoId",
  targetKey: "id",
});

Produtos.hasMany(Arquivos, {
  foreignKey: "produtoId",
  sourceKey: "id",
  onDelete: "CASCADE", // Optional: Deletes related files when a product is deleted
});
Arquivos.belongsTo(Produtos, {
  foreignKey: "produtoId",
  targetKey: "id",
});

Produtos.hasOne(Links, {
  foreignKey: "produtoId",
  sourceKey: "id",
  onDelete: "CASCADE", // Optional: Deletes related files when a product is deleted
});
Links.belongsTo(Produtos, {
  foreignKey: "produtoId",
  targetKey: "id",
});

Produtos.hasMany(CrmProdutos, {
  foreignKey: "produtoId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
CrmProdutos.belongsTo(Produtos, {
  foreignKey: "produtoId",
  targetKey: "id",
});

Produtos.hasMany(Favoritos, {
  foreignKey: "produtoId",
  sourceKey: "id",
  onDelete: "CASCADE",
});
Favoritos.belongsTo(Produtos, {
  foreignKey: "produtoId",
  targetKey: "id",
});

module.exports = Produtos;

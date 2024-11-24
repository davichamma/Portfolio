const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/jwtMiddleware");
const produtos = require("../controllers/produtos");
const favoritos = require("../controllers/favoritos");

router.get(
  "/produtosPortfolio/all",
  verifyToken,
  produtos.getAllProdutosPortfolio
);
router.get("/produtos/all", verifyToken, produtos.getAllProdutos);
router.get("/produtosCRM", verifyToken, produtos.getAllProdutosCRM);
router.get("/produtos/:cnae/:porte", verifyToken, produtos.getProdutos);
router.get("/clientes/:cnpj", verifyToken, produtos.getClientes);
router.get("/favs/:usuario", verifyToken, favoritos.getAllFavs);
router.get("/categorias", verifyToken, produtos.getAllCategories);
router.get("/linhasNegocio", verifyToken, produtos.getAllBusinessLines);

module.exports = router;

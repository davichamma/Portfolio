const express = require("express");
const empresas = require("../controllers/empresas");
const { verifyToken } = require("../middleware/jwtMiddleware");

const empresasRoutes = express.Router();

empresasRoutes.get("/empresas", verifyToken, empresas.findAll);
empresasRoutes.get("/empresas/:cnpj", verifyToken, empresas.findEmpresa);
empresasRoutes.get("/contatos/:cnpj", verifyToken, empresas.findContatos);
empresasRoutes.get("/socios/:cnpj", verifyToken, empresas.findSocios);
empresasRoutes.get("/cnaes", verifyToken, empresas.findAllCnaes);
empresasRoutes.get(
  "/cnaes/:codigo",
  verifyToken,
  empresas.findCnaesSecundarios
);
empresasRoutes.get(
  "/cnaesSecundarios/:cnpj",
  verifyToken,
  empresas.findCnaesSecundarios
);
empresasRoutes.get("/situacoes/:cnpj", verifyToken, empresas.findSituacao);

module.exports = empresasRoutes;

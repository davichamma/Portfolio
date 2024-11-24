const express = require("express");
const empresasEconodata = require("../controllers/empresasEconodata");
const { verifyToken } = require("../middleware/jwtMiddleware");

const empresasEconodataRoutes = express.Router();

empresasEconodataRoutes.get(
  "/empresasEconodata",
  verifyToken,
  empresasEconodata.findAll
);
empresasEconodataRoutes.get(
  "/empresasEconodata/:cnpj",
  verifyToken,
  empresasEconodata.findEmpresa
);

module.exports = empresasEconodataRoutes;

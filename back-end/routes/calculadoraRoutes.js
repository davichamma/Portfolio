const express = require("express");
const calculadora = require("../controllers/calculadora");
const { verifyToken } = require("../middleware/jwtMiddleware");

const calculadoraRoutes = express.Router();

calculadoraRoutes.get("/calculadora", verifyToken, calculadora.findAll);

calculadoraRoutes.get(
  "/calculadora/avaliacoesAmbientais",
  verifyToken,
  calculadora.findAllAvaliacoesAmbientais
);

calculadoraRoutes.get(
  "/calculadora/consultorias",
  verifyToken,
  calculadora.findAllConsultorias
);

calculadoraRoutes.get(
  "/calculadora/deslocamentos/:sps/:assti",
  verifyToken,
  calculadora.findAllDeslocamentos
);

calculadoraRoutes.get(
  "/calculadora/deslocamentoProprio",
  verifyToken,
  calculadora.findAllDeslocamentosProprios
);

calculadoraRoutes.get("/calculadora/sps", verifyToken, calculadora.findAllSPS);

calculadoraRoutes.get(
  "/calculadora/exames",
  verifyToken,
  calculadora.findAllExames
);

calculadoraRoutes.get(
  "/calculadora/assti",
  verifyToken,
  calculadora.findAllASSTI
);

calculadoraRoutes.get(
  "/calculadora/mentis",
  verifyToken,
  calculadora.findAllMentis
);

calculadoraRoutes.get(
  "/calculadora/cursos",
  verifyToken,
  calculadora.findAllCursos
);

calculadoraRoutes.get(
  "/calculadora/cursosCredenciados",
  verifyToken,
  calculadora.findCursosCredenciados
);

calculadoraRoutes.get(
  "/calculadora/credenciadoOptions",
  verifyToken,
  calculadora.findCredenciadosOptions
);

calculadoraRoutes.get(
  "/calculadora/telemedicina",
  verifyToken,
  calculadora.findAllTelemedicina
);

calculadoraRoutes.get(
  "/calculadora/odontologia",
  verifyToken,
  calculadora.findAllOdontologia
);

module.exports = calculadoraRoutes;

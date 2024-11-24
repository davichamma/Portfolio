const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/jwtMiddleware");
const arquivos = require("../controllers/arquivos");

router.get("/arquivos/:username", verifyToken, arquivos.getAllArquivos);

module.exports = router;

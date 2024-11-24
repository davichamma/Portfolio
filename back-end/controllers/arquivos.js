const ArquivosRepository = require("../models/arquivosModel");

async function getAllArquivos(req, res) {
  ArquivosRepository.findAll().then((result) => res.json(result));
}

module.exports = {
  getAllArquivos,
};

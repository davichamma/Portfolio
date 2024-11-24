const OdsRepository = require("../models/odsModel");

async function getAllOds(req, res) {
  OdsRepository.findAll().then((result) => res.json(result));
}

module.exports = {
  getAllOds,
};

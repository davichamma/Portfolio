const { Op } = require("sequelize");
const EmpresasRepository = require("../models/empresasModel");
const ContatosRepository = require("../models/contatosModel");
const SociosRepository = require("../models/sociosModel");
const CnaesRepository = require("../models/cnaesModel");
const CnaesSecundariosRepository = require("../models/cnaesSecundariosModel");
const SituacaoRepository = require("../models/situacoesModel");
const { adjustCnpj } = require("../utils/masks");

async function findAll(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  const offset = (page - 1) * limit;

  try {
    const { rows: results, count: total } =
      await EmpresasRepository.findAndCountAll({
        offset,
        limit,
      });

    const totalPages = Math.ceil(total / limit);

    res.json({
      results,
      currentPage: page,
      totalPages,
      totalResults: total,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

async function findEmpresa(req, res) {
  const { cnpj } = req.params;

  EmpresasRepository.findAll({
    where: {
      cnpj: {
        [Op.like]: `${adjustCnpj(cnpj)}%`,
      },
    },
  }).then((result) => res.json(result));
}

function findContatos(req, res) {
  const { cnpj } = req.params;
  ContatosRepository.findByPk(cnpj).then((result) => res.json(result));
}

function findSocios(req, res) {
  const { cnpj } = req.params;
  SociosRepository.findByPk(cnpj).then((result) => res.json(result));
}

function findAllCnaes(req, res) {
  CnaesRepository.findAll().then((result) => res.json(result));
}

function findCnae(req, res) {
  const { codigo } = req.params;
  CnaesRepository.findByPk(codigo).then((result) => res.json(result));
}

function findCnaesSecundarios(req, res) {
  const { cnpj } = req.params;
  CnaesSecundariosRepository.findAll(cnpj).then((result) => res.json(result));
}

function findSituacao(req, res) {
  const { cnpj } = req.params;
  SituacaoRepository.findByPk(cnpj).then((result) => res.json(result));
}

module.exports = {
  findEmpresa,
  findAll,
  findContatos,
  findSocios,
  findAllCnaes,
  findCnae,
  findCnaesSecundarios,
  findSituacao,
};

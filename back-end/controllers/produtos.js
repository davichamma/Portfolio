const db = require("../db");
const ProdutosRepository = require("../models/produtosModel");
const OdsModel = require("../models/odsModel");
const ArquivosModel = require("../models/arquivosModel");
const LinksModel = require("../models/linksModel");
const ProdutoPortfolioRepository = require("../models/produtosPortfolioModel");
const CategoriasRepository = require("../models/categoriasModel");
const LinhasNegociosRepository = require("../models/linhasNegociosModel");

const adjustCnpj = (cnpj) => {
  return cnpj.replace(/[./-]/g, "");
};

const getClientes = async (req, res) => {
  try {
    const { cnpj } = req.params;
    const [results] = await db.query(
      `SELECT
          *
        FROM
          VW_ProdutosSESI vps
        WHERE
          vps.cnpjCpf = :cnpj
        ORDER BY 
          vps.codigoProduto`,
      {
        replacements: {
          cnpj: adjustCnpj(cnpj),
        },
      }
    );

    res.json({
      results,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching data", error: error.message });
  }
};

const getProdutos = async (req, res) => {
  try {
    const { cnae, porte } = req.params;

    const [results] = await db.query(
      `SELECT
            p.*,
            (
                SELECT o.ods
                FROM ods o
                WHERE o.produtoId = p.id
                FOR JSON PATH
            ) AS ods
        FROM
            VW_PotencialVenda pv
        LEFT JOIN crmProdutos cp 
            ON pv.codigoServico = cp.codErp
        LEFT JOIN produtos p 
            ON cp.produtoId = p.id
        LEFT JOIN ods o 
            ON p.id = o.produtoId
        WHERE cnae = :cnae 
              AND porte = :porte
              AND p.id IS NOT NULL
        GROUP BY
          p.id,
          p.produto,
          p.categoria,
          p.linhaNegocio,
          p.familia,
          p.subsidio,
          p.entregaveis,
          p.prazoEntrega,
          p.descricao,
          p.funcionamento,
          p.publicoAlvo,
          p.lei,
          p.horas,
          p.beneficios,
          p.modalidade,
          p.createdAt,
          p.updatedAt
        
      ;`,
      {
        replacements: {
          cnae: cnae.trim(),
          porte: porte.trim(),
        },
      }
    );

    res.json({
      results,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching data", error: error.message });
  }
};

const getAllProdutos = async (req, res) => {
  try {
    const [results] = await db.query(
      `SELECT DISTINCT 
          pv.codigoServico,
          pv.nomeServico,
          pv.linkUrl,
          pv.descricao
      FROM
        VW_PotencialVenda pv`
    );

    res.json({
      results,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching data", error: error.message });
  }
};

const getAllProdutosPortfolio = async (req, res) => {
  try {
    const results = await ProdutosRepository.findAll({
      include: [
        {
          model: OdsModel,
          attributes: ["ods"],
          required: false,
        },
        {
          model: ArquivosModel,
          attributes: ["url", "data"],
          required: false,
        },
        {
          model: LinksModel,
          attributes: ["url"],
          required: false,
        },
      ],
      order: [[OdsModel, "ods", "ASC"]],
    });
    res.json(results);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching portfolio data", error: error.message });
  }
};

async function getAllProdutosCRM(req, res) {
  ProdutoPortfolioRepository.findAll().then((result) => res.json(result));
}

async function getAllCategories(req, res) {
  CategoriasRepository.findAll().then((result) => res.json(result));
}

async function getAllBusinessLines(req, res) {
  LinhasNegociosRepository.findAll().then((result) => res.json(result));
}

module.exports = {
  getProdutos,
  getClientes,
  getAllProdutos,
  getAllProdutosPortfolio,
  getAllProdutosCRM,
  getAllCategories,
  getAllBusinessLines,
};

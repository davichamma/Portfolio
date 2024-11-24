const sequelize = require("../db");
const EmpresasEconodataRepository = require("../models/empresasEconodataModel");

async function findAll(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  const offset = (page - 1) * limit;

  try {
    const { rows: results, count: total } =
      await EmpresasEconodataRepository.findAndCountAll({
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
      .json({ message: "Error fetching data", error: error.message });
  }
}

async function findEmpresa(req, res) {
  const { cnpj } = req.params;

  const query = `
    SELECT 
      ee.cnpj,
      ee.codigoCnae codigo,
      ee.qtdFuncionariosAteMacro,
      ee.qtdFuncionariosDeMacro,
      ee.faturamentoAteMacro,
      ee.faturamentoDeMacro,
      ee.valorFaturamento,
      c.texto,
      ee.porte,
      e.nome,
      e.abertura,
      e.fantasia,
      e.capitalSocial,
      e.atualizacao
    FROM 
      empresasEconodata ee
    LEFT JOIN cnaes c ON 
      ee.codigoCnae = c.codigo
    LEFT JOIN empresas e ON 
      ee.cnpj = e.cnpj
    WHERE ee.cnpj =  :cnpj
  `;

  try {
    const empresaData = await sequelize.query(query, {
      replacements: { cnpj },
      type: sequelize.QueryTypes.SELECT,
    });
    res.json(empresaData);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching data", error: error.message });
  }
}

module.exports = {
  findEmpresa,
  findAll,
};

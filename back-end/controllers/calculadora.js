const db = require("../db");

const findAll = async (req, res) => {
  try {
    const [results] = await db.query(
      `SELECT * FROM CalculadoraSST.dbo.tabelaPrecificacao tp `
    );

    res.json({
      results,
    });
  } catch (error) {
    console.error("Error executing SQL query:", error);
    res
      .status(500)
      .json({ message: "Error fetching data", error: error.message });
  }
};

const findAllAvaliacoesAmbientais = async (req, res) => {
  try {
    const [results] = await db.query(
      `SELECT * FROM CalculadoraSST.dbo.calculoAvaliacoesAmbientais caa ORDER BY caa.avaliacao`
    );

    res.json({
      results,
    });
  } catch (error) {
    console.error("Error executing SQL query:", error);
    res
      .status(500)
      .json({ message: "Error fetching data", error: error.message });
  }
};

const findAllConsultorias = async (req, res) => {
  try {
    const [results] = await db.query(
      `SELECT * FROM CalculadoraSST.dbo.calculoGestaoIntegrada caa`
    );

    res.json({
      results,
    });
  } catch (error) {
    console.error("Error executing SQL query:", error);
    res
      .status(500)
      .json({ message: "Error fetching data", error: error.message });
  }
};

const findAllDeslocamentos = async (req, res) => {
  try {
    const { sps, assti } = req.params;
    const [results] = await db.query(
      `SELECT * FROM CalculadoraSST.dbo.${
        parseInt(sps)
          ? "calculoDeslocamentoSPS cdsps"
          : parseInt(assti)
          ? "calculoDeslocamentoASSTI cdassti"
          : "calculoDeslocamento cd "
      }`
    );

    res.json({
      results,
    });
  } catch (error) {
    console.error("Error executing SQL query:", error);
    res
      .status(500)
      .json({ message: "Error fetching data", error: error.message });
  }
};

const findAllDeslocamentosProprios = async (req, res) => {
  try {
    const [results] = await db.query(
      `SELECT * FROM CalculadoraSST.dbo.calculoDeslocamentoProprioSPS ORDER BY indice`
    );

    res.json({
      results,
    });
  } catch (error) {
    console.error("Error executing SQL query:", error);
    res
      .status(500)
      .json({ message: "Error fetching data", error: error.message });
  }
};

const findAllSPS = async (req, res) => {
  try {
    const [results] = await db.query(
      `SELECT * FROM CalculadoraSST.dbo.calculoSPS csps`
    );

    res.json({
      results,
    });
  } catch (error) {
    console.error("Error executing SQL query:", error);
    res
      .status(500)
      .json({ message: "Error fetching data", error: error.message });
  }
};

const findAllExames = async (req, res) => {
  try {
    const [results] = await db.query(
      `SELECT * FROM CalculadoraSST.dbo.exames e`
    );

    res.json({
      results,
    });
  } catch (error) {
    console.error("Error executing SQL query:", error);
    res
      .status(500)
      .json({ message: "Error fetching data", error: error.message });
  }
};

const findAllASSTI = async (req, res) => {
  try {
    const [results] = await db.query(
      `SELECT * FROM CalculadoraSST.dbo.consultoriaASSTI cassti`
    );

    res.json({
      results,
    });
  } catch (error) {
    console.error("Error executing SQL query:", error);
    res
      .status(500)
      .json({ message: "Error fetching data", error: error.message });
  }
};

const findAllMentis = async (req, res) => {
  try {
    const [results] = await db.query(
      `SELECT * FROM CalculadoraSST.dbo.mentis m`
    );

    res.json({
      results,
    });
  } catch (error) {
    console.error("Error executing SQL query:", error);
    res
      .status(500)
      .json({ message: "Error fetching data", error: error.message });
  }
};

const findAllCursos = async (req, res) => {
  try {
    const [results] = await db.query(
      `SELECT * FROM CalculadoraSST.dbo.calculoTreinamentos ct`
    );

    res.json({
      results,
    });
  } catch (error) {
    console.error("Error executing SQL query:", error);
    res
      .status(500)
      .json({ message: "Error fetching data", error: error.message });
  }
};

const findCursosCredenciados = async (req, res) => {
  try {
    const [results] = await db.query(
      `SELECT * FROM CalculadoraSST.dbo.calculoTreinamentosCredenciados ctc`
    );

    res.json({
      results,
    });
  } catch (error) {
    console.error("Error executing SQL query:", error);
    res
      .status(500)
      .json({ message: "Error fetching data", error: error.message });
  }
};

const findCredenciadosOptions = async (req, res) => {
  try {
    const [results] = await db.query(
      `SELECT * FROM CalculadoraSST.dbo.credenciado`
    );

    res.json({
      results,
    });
  } catch (error) {
    console.error("Error executing SQL query:", error);
    res
      .status(500)
      .json({ message: "Error fetching data", error: error.message });
  }
};

const findAllTelemedicina = async (req, res) => {
  try {
    const [results] = await db.query(
      `SELECT * FROM CalculadoraSST.dbo.calculoTelemedicina ct`
    );

    res.json({
      results,
    });
  } catch (error) {
    console.error("Error executing SQL query:", error);
    res
      .status(500)
      .json({ message: "Error fetching data", error: error.message });
  }
};

const findAllOdontologia = async (req, res) => {
  try {
    const [results] = await db.query(
      `SELECT * FROM CalculadoraSST.dbo.calculoOdontologico co`
    );

    res.json({
      results,
    });
  } catch (error) {
    console.error("Error executing SQL query:", error);
    res
      .status(500)
      .json({ message: "Error fetching data", error: error.message });
  }
};

module.exports = {
  findAll,
  findAllAvaliacoesAmbientais,
  findAllConsultorias,
  findAllDeslocamentos,
  findAllSPS,
  findAllDeslocamentosProprios,
  findAllExames,
  findAllASSTI,
  findAllMentis,
  findAllCursos,
  findCursosCredenciados,
  findCredenciadosOptions,
  findAllTelemedicina,
  findAllOdontologia,
};

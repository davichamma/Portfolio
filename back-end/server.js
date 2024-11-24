const express = require("express");
const cors = require("cors");
const logsRoutes = require("./routes/logsRoutes");
const empresasRoutes = require("./routes/empresasRoutes");
const empresasEconodataRoutes = require("./routes/empresasEconodataRoutes");
const usuariosRoutes = require("./routes/usuariosRoutes");
const produtosRoutes = require("./routes/produtosRoutes");
const calculadoraRoutes = require("./routes/calculadoraRoutes");
const portfolioDB = require("./db");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(logsRoutes);
app.use(empresasRoutes);
app.use(empresasEconodataRoutes);
app.use(usuariosRoutes);
app.use(produtosRoutes);
app.use(calculadoraRoutes);

const syncDatabases = async () => {
  try {
    await portfolioDB.sync();
    console.log(`Database connected: ${process.env.PORTFOLIO_DB}`);
  } catch (error) {
    console.error("Error syncing databases:", error);
  }
};

app.listen(3001, async () => {
  console.log("Servidor iniciado na porta 3001");
  await syncDatabases();
});

const LogsRepository = require("../models/logsModel");

async function findLogs(req, res) {
  const { username } = req.params;

  LogsRepository.findAll({
    where: {
      usuario: username,
    },
  }).then((result) => res.json(result));
}

module.exports = {
  findLogs,
};

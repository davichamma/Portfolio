const { createToken } = require("../middleware/jwtMiddleware");
const SearchesRepository = require("../models/searchesModel");

async function loginUser(req, res) {
  try {
    const { user, token } = req.body;
    if (token === process.env.SECRET) {
      const newToken = createToken(user);

      res.json({ token: newToken });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

function getAllSearches(req, res) {
  const { usuario } = req.params;
  SearchesRepository.findAll({
    where: { usuario },
    order: [["id", "DESC"]],
  }).then((result) => res.json(result));
}

function addSearch(req, res) {
  const { search } = req.body;
  SearchesRepository.create({
    search: search.search,
    usuario: search.usuario,
  }).then((result) => res.json(result));
}

function removeSearches(req, res) {
  const { searches } = req.body;
  SearchesRepository.destroy({
    where: { id: searches },
  }).then((result) => res.json(result));
}

module.exports = {
  loginUser,
  getAllSearches,
  removeSearches,
  addSearch,
};

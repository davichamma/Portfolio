const FavsRepository = require("../models/favoritosModel");
const ProdutoRepository = require("../models/produtosModel");

async function getAllFavs(req, res) {
  const { usuario } = req.params;

  try {
    const favoriteProducts = await FavsRepository.findAll({
      where: { usuario },
      attributes: ["produtoId"],
      include: [
        {
          model: ProdutoRepository,
          attributes: ["categoria", "linhaNegocio"],
          required: false,
        },
      ],
    });

    res.json(favoriteProducts);
  } catch (error) {
    console.error("Error fetching favorite products:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching favorites." });
  }
}

module.exports = {
  getAllFavs,
};

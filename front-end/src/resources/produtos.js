import api from "../services/api";

const getAllProdutosPortfolio = (token) =>
  api.get(`/produtosPortfolio/all`, {
    headers: { authorization: token },
  });

const getAllProdutos = (token) =>
  api.get(`/produtos/all`, {
    headers: { authorization: token },
  });

const getProdutos = (cnae, porte, token) =>
  api.get(`/produtos/${cnae}/${porte}`, {
    headers: { authorization: token },
  });

const getFavs = (usuario, token) =>
  api.get(`/favs/${usuario}`, {
    headers: { authorization: token },
  });

const getClientes = (cnpj, token) =>
  api.get(`/clientes/${cnpj}`, {
    headers: { authorization: token },
  });

const getAllCategories = (token) =>
  api.get(`/categorias`, {
    headers: { authorization: token },
  });

const getAllBusinessLines = (token) =>
  api.get(`/linhasNegocio`, {
    headers: { authorization: token },
  });

export {
  getProdutos,
  getClientes,
  getAllProdutos,
  getAllProdutosPortfolio,
  getFavs,
  getAllCategories,
  getAllBusinessLines,
};

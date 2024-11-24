import api from "../services/api";

const getAllEmpresas = (token) =>
  api.get(`/empresas`, { headers: { authorization: token } });

const getEmpresas = (cnpj, token) =>
  api.get(`/empresas/${cnpj}`, {
    headers: { authorization: token },
  });

export { getAllEmpresas, getEmpresas };

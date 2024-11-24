import api from "../services/api";

const getAllEmpresasEconodata = (token) =>
  api.get(`/empresasEconodata`, {
    headers: { authorization: token },
  });

const getEmpresasEconodata = (cnpj, token) =>
  api.get(`/empresasEconodata/${cnpj}`, {
    headers: { authorization: token },
  });

export { getAllEmpresasEconodata, getEmpresasEconodata };

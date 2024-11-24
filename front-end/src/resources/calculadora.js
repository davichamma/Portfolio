import api from "../services/api";

const getAllPrecos = (token) =>
  api.get(`/calculadora`, { headers: { authorization: token } });

const getAllAvaliacoesAmbientais = (token) =>
  api.get(`/calculadora/avaliacoesAmbientais`, {
    headers: { authorization: token },
  });

const getAllConsultorias = (token) =>
  api.get(`/calculadora/consultorias`, {
    headers: { authorization: token },
  });

const getAllDeslocamentos = (token, sps, assti) =>
  api.get(`/calculadora/deslocamentos/${sps}/${assti}`, {
    headers: { authorization: token },
  });

const getAllDeslocamentosProprios = (token) =>
  api.get(`/calculadora/deslocamentoProprio`, {
    headers: { authorization: token },
  });

const getAllSPS = (token) =>
  api.get(`/calculadora/sps`, {
    headers: { authorization: token },
  });

const getAllExames = (token) =>
  api.get(`/calculadora/exames`, {
    headers: { authorization: token },
  });

const getAllASSTI = (token) =>
  api.get(`/calculadora/assti`, {
    headers: { authorization: token },
  });

const getAllMentis = (token) =>
  api.get(`/calculadora/mentis`, {
    headers: { authorization: token },
  });

const getAllCursos = (token) =>
  api.get(`/calculadora/cursos`, {
    headers: { authorization: token },
  });

const getAllCursosCredenciado = (token) =>
  api.get(`/calculadora/cursosCredenciados`, {
    headers: { authorization: token },
  });

const getCredenciadoOptions = (token) =>
  api.get(`/calculadora/credenciadoOptions`, {
    headers: { authorization: token },
  });

const getAllTelemedicina = (token) =>
  api.get(`/calculadora/telemedicina`, {
    headers: { authorization: token },
  });

const getAllOdontologia = (token) =>
  api.get(`/calculadora/odontologia`, {
    headers: { authorization: token },
  });

export {
  getAllPrecos,
  getAllAvaliacoesAmbientais,
  getAllConsultorias,
  getAllDeslocamentos,
  getAllSPS,
  getAllDeslocamentosProprios,
  getAllExames,
  getAllASSTI,
  getAllMentis,
  getAllCursos,
  getAllCursosCredenciado,
  getCredenciadoOptions,
  getAllTelemedicina,
  getAllOdontologia,
};

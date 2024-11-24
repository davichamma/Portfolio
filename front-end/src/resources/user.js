import api from "../services/api";

const signIn = (user) => api.post("/users/login", user);

const getAllSearches = (token, usuario) =>
  api.get(`/users/searches/${usuario}`, {
    headers: { authorization: token },
  });

const removeSearch = (searches, token) =>
  api.delete(`/users/searches`, {
    headers: { authorization: token },
    data: { searches },
  });

const addSearch = (search, token) =>
  api.post(
    `/users/searches`,
    { search },
    {
      headers: { authorization: token },
    }
  );

export { signIn, getAllSearches, removeSearch, addSearch };

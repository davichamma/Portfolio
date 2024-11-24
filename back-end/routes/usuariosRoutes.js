const express = require("express");
const { verifyToken } = require("../middleware/jwtMiddleware");
const users = require("../controllers/usuarios");

const usersRoutes = express.Router();

usersRoutes.post("/users/login", users.loginUser);

usersRoutes.get("/users/searches/:usuario", verifyToken, users.getAllSearches);

usersRoutes.delete("/users/searches", verifyToken, users.removeSearches);

usersRoutes.post("/users/searches", verifyToken, users.addSearch);

module.exports = usersRoutes;

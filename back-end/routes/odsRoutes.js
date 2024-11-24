const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/jwtMiddleware");
const ods = require("../controllers/ods");

router.get("/ods/:username", verifyToken, ods.getAllOds);

module.exports = router;

const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/jwtMiddleware");
const logs = require("../controllers/logs");

router.get("/logs/:username", verifyToken, logs.findLogs);

module.exports = router;

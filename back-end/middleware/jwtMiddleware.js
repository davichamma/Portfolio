const jwt = require("jsonwebtoken");

const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.SECRET_TOKEN, { expiresIn: "3h" });
};

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).json({ message: "Acesso proibido." });
  }

  jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Não autorizado." });
    }

    req.userId = decoded.userId;
    next();
  });
};

module.exports = { createToken, verifyToken };

const jwt = require("jsonwebtoken");
const { buildResponse } = require("../utils/responseBuilder");
//========================================
// Verificar token
//========================================
const checkToken = (req, res, next) => {
  const token = req.get("token");
  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      buildResponse({ err: { message: "Token no válido" } }, res);
      return;
    }
    req.usuario = decoded.usuario;
    next();
  });
};

//========================================
// Verificar token img
//========================================
const checkTokenImg = ({ usuario, query: { token } }, res, next) => {
  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      buildResponse({ err: { message: "Token no válido" } }, res);
      return;
    }
    usuario = decoded.usuario;
    next();
  });
};

module.exports = {
  checkToken,
  checkTokenImg,
};

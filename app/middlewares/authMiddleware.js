const jwt = require("jsonwebtoken");
const { buildResponse } = require("../utils/responseBuilder");
//========================================
// Verificar token
//========================================
const checkToken = (req, res, next) => {
  const token = req.get("token");
  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      buildResponse(err, res);
      return;
    }
    require.usuario = decoded.usuario;
    next();
  });
};

module.exports = {
  checkToken,
};

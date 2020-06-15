const { buildResponse } = require("../utils/responseBuilder");
//========================================
// Verificar rol
//========================================
const checkAdminRole = (req, res, next) => {
  const usuario = req.usuario;
  if (usuario.role === "ADMIN_ROLE") {
    next();
  } else {
    return buildResponse({ err: { message: "No es Admin" } }, res);
  }
};

module.exports = { checkAdminRole };

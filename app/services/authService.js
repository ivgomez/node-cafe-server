const UsuarioService = require("./usuarioService");
const bcrypt = require("bcryptjs");
const { createErrorResponse } = require("../utils/responseBuilder");

class AuthService {
  constructor() {
    this.usuarioService = new UsuarioService();
  }
  login = ({ email, password }, callback) => {
    this.usuarioService.getUserByEmail(email, (data) => {
      if (data.ok) {
        if (!bcrypt.compareSync(password, data.usuario.password)) {
          callback(
            createErrorResponse({
              message: "Usuario o (contraseña) incorrectos",
            })
          );
          return;
        }
        callback(data);
      } else {
        callback(createErrorResponse(data.err));
      }
    });
  };
}

module.exports = AuthService;

const UsuarioService = require("./usuarioService");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const {
  createErrorResponse,
  createOkResponse,
} = require("../utils/responseBuilder");

class AuthService {
  constructor() {
    this.usuarioService = new UsuarioService();
  }

  setToken = (data) => {
    return jwt.sign(
      {
        usuario: data,
      },
      process.env.SEED,
      { expiresIn: process.env.CADUCIDAD_TOKEN }
    );
  };

  login = ({ email, password }, callback) => {
    this.usuarioService.getUserByEmail(email, (data) => {
      console.log(data);
      if (data.ok) {
        if (!bcrypt.compareSync(password, data.usuario.password)) {
          callback(
            createErrorResponse({
              message: "Usuario o (contraseña) incorrectos",
            })
          );
          return;
        }
        const token = this.setToken(data.usuario);
        callback(createOkResponse({ usuario: data.usuario, token }));
      } else {
        callback(createErrorResponse(data.err));
      }
    });
  };
}

module.exports = AuthService;

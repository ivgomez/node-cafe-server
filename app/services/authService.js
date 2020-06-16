const UsuarioService = require("./usuarioService");
const { buildResponse } = require("../utils/responseBuilder");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);
const {
  createErrorResponse,
  createOkResponse,
} = require("../utils/responseBuilder");

class AuthService {
  constructor() {
    this.usuarioService = new UsuarioService();
  }

  // GOOGLE SETTINGS
  checkGoogleUser = async (token) => {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return {
      nombre: payload.name,
      email: payload.email,
      img: payload.picture,
      google: true,
    };
  };

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

  googleLogin = async (token, callback) => {
    const googleUser = await this.checkGoogleUser(token).catch((e) => {
      callback(createErrorResponse(e));
    });
    const email = googleUser.email;
    this.usuarioService.getUserByGoogleEmail({ email }, (data) => {
      if (data.ok && data.usuario) {
        const token = this.setToken(data);
        console.log("existe y data ok:");
        callback(createOkResponse({ usuario: data.usuario, token }));
      } else {
        console.log("no existe y data:");
        this.usuarioService.createUsuario(googleUser, (p) =>
          callback(createOkResponse(p))
        );
      }
    });
  };
}

module.exports = AuthService;

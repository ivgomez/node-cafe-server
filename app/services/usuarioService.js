const Usuario = require("../schemas/usuarioSchema");
const _ = require("underscore");
const bcrypt = require("bcryptjs");
const {
  createErrorResponse,
  createOkResponse,
} = require("../utils/responseBuilder");

class UsuarioService {
  constructor() {}
  getAllUsers = (desde = 0, limite = 5, callback) => {
    Usuario.find({ estado: true }, "nombre email role estado google img")
      .skip(desde)
      .limit(limite)
      .exec((err, usuarios) => {
        if (err) {
          callback(createErrorResponse(err));
          return;
        }
        Usuario.countDocuments({ estado: true }, (err, conteo) => {
          callback(
            createOkResponse({
              usuarios,
              conteo,
            })
          );
        });
      });
  };

  createUsuario = ({ nombre, email, password, role, google }, callback) => {
    const usuario = new Usuario({
      nombre,
      email,
      password: password ? bcrypt.hashSync(password, 10) : ":)",
      role: role || "USER_ROLE",
      google,
    });
    usuario.save((err, usuarioDB) => {
      if (err) {
        callback(createErrorResponse(err));
        return;
      }
      callback(
        createOkResponse({
          usuario: usuarioDB,
        })
      );
    });
  };

  getUserByEmail = (email, callback) => {
    this.getByQuery({ email }, callback);
  };

  getByQuery = (query, callback) => {
    Usuario.findOne(query, (err, usuarioDB) => {
      if (err) {
        callback(createErrorResponse(err));
        return;
      }

      if (!usuarioDB) {
        callback(
          createErrorResponse({
            message: "Usuario no encontrado",
          })
        );
        return;
      }
      callback(
        createOkResponse({
          usuario: usuarioDB,
        })
      );
    });
  };

  getUserByGoogleEmail = (query, callback) => {
    Usuario.findOne(query, (err, usuarioDB) => {
      if (err) {
        callback(createErrorResponse(err));
        return;
      }

      if (usuarioDB && usuarioDB.google === false) {
        callback(
          createErrorResponse({
            message: "Debe usar su autenticación normal",
          })
        );
      } else {
        callback(
          createOkResponse({
            usuario: usuarioDB,
          })
        );
      }
    });
  };

  updateUser = (query, callback) => {
    let id = query.params.id;
    let body = _.pick(query.body, ["nombre", "email", "img", "role", "estado"]);
    Usuario.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true },
      (err, usuarioDB) => {
        if (err) {
          callback(createErrorResponse(err));
          return;
        } else {
          callback(createOkResponse({ usuario: usuarioDB }));
        }
      }
    );
  };

  deleteUser = (query, callback) => {
    let id = query.params.id;
    let cambiaEstado = {
      estado: false,
    };

    Usuario.findByIdAndUpdate(
      id,
      cambiaEstado,
      { new: true },
      (err, usuarioBorrado) => {
        if (err) {
          return callback(createErrorResponse(err));
        }

        if (usuarioBorrado === null) {
          return callback(
            createErrorResponse({ message: "Usuario no encontrado" })
          );
        }
        callback(createOkResponse({ usuario: usuarioBorrado }));
      }
    );
  };
}

module.exports = UsuarioService;

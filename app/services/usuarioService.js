const Usuario = require("../schemas/usuarioSchema");
const pick = require("underscore");
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

  createUsuario = ({ nombre, email, password, role }, callback) => {
    let usuario = new Usuario({
      nombre,
      email,
      password: bcrypt.hashSync(password, 10),
      role,
    });

    usuario.save((err, usuarioDB) => {
      if (err) {
        callback(createErrorResponse(err));
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

  getUserById = (id, callback) => {
    this.getByQuery({ id }, callback);
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
        console.log("err", err);
        console.log("usuarioBorrado", usuarioBorrado);
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

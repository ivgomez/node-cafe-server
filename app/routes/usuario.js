const express = require("express");
const UsuarioService = require("../services/usuarioService");
const { buildResponse } = require("../utils/responseBuilder");
const { checkToken } = require("../middlewares/authMiddleware");
const { checkAdminRole } = require("../middlewares/checkRoleMiddleware");
const app = express();
const us = new UsuarioService();
const route = "/usuarios";

//GET ALL USERS
/**
 * @swagger
 * /usuarios:
 *  get:
 *    tags:
 *      - usuarios
 *    description: Endpoint to get all users
 *    produces:
 *     - application/json
 *    responses:
 *      '200':
 *        description: A succesfull response
 */
app.get(route, [checkToken], (req, res) => {
  const { desde = 0, limite = 5 } = req.query;
  us.getAllUsers(Number(desde), Number(limite), (p) => buildResponse(p, res));
});

//CREATE USER
app.post(route, [checkToken, checkAdminRole], (req, res) => {
  let body = req.body;
  us.createUsuario(body, (p) => buildResponse(p, res));
});

// GET USER BY EMAIL
app.get(`${route}/email/:email`, checkToken, (req, res) => {
  const { email } = req.params;
  us.getUserByEmail(email, (p) => buildResponse(p, res));
});

// UPDATE USER
app.put(`${route}/:id`, [checkToken, checkAdminRole], (req, res) => {
  us.updateUser(req, (p) => buildResponse(p, res));
});

// DELETE USER
app.delete(`${route}/:id`, [checkToken, checkAdminRole], (req, res) => {
  us.deleteUser(req, (p) => buildResponse(p, res));
});

module.exports = app;

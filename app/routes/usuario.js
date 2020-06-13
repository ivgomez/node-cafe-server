const express = require("express");
const UsuarioService = require("../services/usuarioService");
const { buildResponse } = require("../utils/responseBuilder");
const app = express();
const us = new UsuarioService();
const route = "/usuarios";

//GET USER
app.get(route, (req, res) => {
  const { desde = 0, limite = 5 } = req.query;
  us.getAllUsers(Number(desde), Number(limite), (p) => buildResponse(p, res));
});

//CREATE USER
app.post(route, (req, res) => {
  let body = req.body;
  us.createUsuario(body, (p) => buildResponse(p, res));
});

app.get(`${route}/email/:email`, (req, res) => {
  const { email } = req.params;
  us.getUserByEmail(email, (p) => buildResponse(p, res));
});

app.get(`${route}/:id`, (req, res) => {
  const { id } = req.params;
  us.getUserById(id, (p) => buildResponse(p, res));
});

// UPDATE USER
app.put(`${route}/update/:id`, (req, res) => {
  us.updateUser(req, (p) => buildResponse(p, res));
});

// DELETE USER
app.delete(`${route}/delete/:id`, (req, res) => {
  us.deleteUser(req, (p) => buildResponse(p, res));
});

module.exports = app;

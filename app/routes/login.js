const express = require("express");
const AuthService = require("../services/authService");
const { buildResponse } = require("../utils/responseBuilder");

const app = express();
const authService = new AuthService();

app.post("/login", (req, res) => {
  authService.login(req.body, (p) => buildResponse(p, res));
});

app.post("/google", async (req, res) => {
  const token = req.body.idtoken;
  await authService.googleLogin(token, (p) => buildResponse(p, res));
});

module.exports = app;

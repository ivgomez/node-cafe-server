const express = require("express");
const app = express();

// usuario route
app.use(require("./usuario"));
// login route
app.use(require("./login"));

module.exports = app;

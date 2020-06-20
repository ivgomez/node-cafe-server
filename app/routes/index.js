const express = require("express");
const app = express();

// usuario route
app.use(require("./usuario"));
// login route
app.use(require("./login"));
// categories route
app.use(require("./category"));
// products route
app.use(require("./product"));
// upload file route
app.use(require("./upload"));

module.exports = app;

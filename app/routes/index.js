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
// display image route
app.use(require("./images"));

module.exports = app;

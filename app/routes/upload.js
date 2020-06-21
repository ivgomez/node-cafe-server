const express = require("express");
const app = express();
const { Routes } = require("../constants/routes");
const fileUpload = require("express-fileupload");
const UploadService = require("../services/uploadService");
const { buildResponse } = require("../utils/responseBuilder");

const upl = new UploadService();
// default options
app.use(fileUpload());

app.put(`${Routes.uploads}/:collectionType/:id`, (req, res) => {
  upl.uploadFile(req, (p) => buildResponse(p, res));
});

module.exports = app;

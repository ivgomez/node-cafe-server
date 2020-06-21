const express = require("express");
const app = express();
const fs = require("fs");
const { Routes } = require("../constants/routes");
const { buildResponse } = require("../utils/responseBuilder");
const ImageService = require("../services/imageService");
const { checkTokenImg } = require("../middlewares/authMiddleware");

const imgServ = new ImageService();

// GET IMAGE
app.get(`${Routes.image}/:collectionType/:img`, checkTokenImg, (req, res) => {
  imgServ.getImage(req, res);
});

module.exports = app;

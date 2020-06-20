const express = require("express");
const app = express();
const ProductService = require("../services/productService");
const { Routes } = require("../constants/routes");
const { checkToken } = require("../middlewares/authMiddleware");
const { checkAdminRole } = require("../middlewares/checkRoleMiddleware");
const { buildResponse } = require("../utils/responseBuilder");

const prod = new ProductService();

//GET PRODUCTS
app.get(Routes.products, checkToken, (req, res) => {
  prod.getProducts(req, (p) => buildResponse(p, res));
});

// GET PRODUCT BY ID
app.get(`${Routes.products}/:id`, checkToken, (req, res) => {
  prod.getProductById(req, (p) => buildResponse(p, res));
});

// CREATE PRODUCT
app.post(Routes.products, checkToken, (req, res) => {
  prod.createProduct(req, (p) => buildResponse(p, res));
});

// UPDATE PRODUCT
app.put(`${Routes.products}/:id`, (req, res) => {
  prod.updateProduct(req, (p) => buildResponse(p, res));
});

// DELETE PRODUCT
app.delete(`${Routes.products}/:id`, checkToken, (req, res) => {
  prod.deleteProduct(req, (p) => buildResponse(p, res));
});

// SEARCH PRODUCT
app.get(`${Routes.products}/search/:query`, checkToken, (req, res) => {
  prod.searchProduct(req, (p) => buildResponse(p, res));
});

module.exports = app;

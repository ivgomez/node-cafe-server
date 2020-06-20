const express = require("express");
const app = express();
const CategoryService = require("../services/categoryService");
const { Routes } = require("../constants/routes");
const { checkToken } = require("../middlewares/authMiddleware");
const { checkAdminRole } = require("../middlewares/checkRoleMiddleware");
const { buildResponse } = require("../utils/responseBuilder");

const cat = new CategoryService();

// GET CATEGORIES
app.get(Routes.category, checkToken, (req, res) => {
  cat.getCategories((p) => buildResponse(p, res));
});

// GET CATEGORY
app.get(`${Routes.category}/:id`, checkToken, (req, res) => {
  cat.getCategoryById(req, (p) => buildResponse(p, res));
});

// ADD CATEGORY
app.post(Routes.category, checkToken, (req, res) => {
  cat.createCategory(req, (p) => buildResponse(p, res));
});

// UPADATE CATEGORY
app.put(`${Routes.category}/:id`, checkToken, (req, res) => {
  cat.updateCategory(req, (p) => buildResponse(p, res));
});

// DELETE CATEGORY
app.delete(
  `${Routes.category}/:id`,
  [checkToken, checkAdminRole],
  (req, res) => {
    cat.deleteCategory(req, (p) => buildResponse(p, res));
  }
);

module.exports = app;

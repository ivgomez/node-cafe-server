const {
  createOkResponse,
  createErrorResponse,
} = require("../utils/responseBuilder");

const Category = require("../schemas/categorySchema");

class CategoryService {
  constructor() {}

  getCategories = (callback) => {
    Category.find({})
      .sort("description")
      .populate("usuario", "nombre email")
      .exec((err, categories) => {
        if (err) {
          return callback(createErrorResponse(err));
        }
        callback(createOkResponse({ categories }));
      });
  };

  getCategoryById = ({ params: { id } }, callback) => {
    Category.findById(id, (err, category) => {
      if (err) {
        return callback(createErrorResponse(err));
      }
      callback(createOkResponse({ category }));
    });
  };

  createCategory = ({ body: { description }, usuario }, callback) => {
    const category = new Category({
      description,
      usuario: usuario._id,
    });

    category.save((err, categoryDB) => {
      if (err || !categoryDB) {
        callback(createErrorResponse(err));
        return;
      }
      callback(
        createOkResponse({
          categoria: categoryDB,
        })
      );
    });
  };

  updateCategory = ({ params: { id }, body: { description } }, callback) => {
    const categoryDesc = {
      description,
    };
    const valOptions = {
      new: true,
      runValidators: true,
    };
    Category.findByIdAndUpdate(
      id,
      categoryDesc,
      valOptions,
      (err, categoryDB) => {
        if (err || !categoryDB) {
          callback(createErrorResponse(err));
          return;
        } else {
          callback(createOkResponse({ category: categoryDB }));
        }
      }
    );
  };

  deleteCategory = ({ params: { id } }, callback) => {
    Category.findOneAndDelete(id, (err, categoryBD) => {
      if (err) {
        return callback(createErrorResponse(err));
      }
      if (!categoryBD) {
        return callback(
          createErrorResponse({ message: "Categoria no encontrada" })
        );
      }
      callback(createOkResponse({ category: categoryBD }));
    });
  };
}

module.exports = CategoryService;

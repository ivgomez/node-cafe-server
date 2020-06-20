const {
  createOkResponse,
  createErrorResponse,
} = require("../utils/responseBuilder");

const Product = require("../schemas/productSchema");

class ProductService {
  constructor() {}

  createProduct = ({ body, usuario }, callback) => {
    const { nombre, precioUni, descripcion, disponible, categoria } = body;
    const product = new Product({
      nombre,
      precioUni,
      descripcion,
      disponible,
      categoria,
      usuario: usuario._id,
    });

    product.save((err, productDB) => {
      if (err || !productDB) {
        callback(createErrorResponse(err));
        return;
      }
      callback(
        createOkResponse({
          producto: productDB,
        })
      );
    });
  };

  updateProduct = ({ body, params: { id } }, callback) => {
    const { nombre, precioUni, descripcion, disponible, categoria } = body;

    Product.findById(id, (err, productDB) => {
      if (err) {
        return callback(createErrorResponse(err));
      }
      if (!productDB) {
        return callback(createErrorResponse({ message: "product not found" }));
      }
      productDB.nombre = nombre;
      productDB.precioUni = precioUni;
      productDB.descripcion = descripcion;
      productDB.disponible = disponible;
      productDB.categoria = categoria;

      productDB.save((err, productSaved) => {
        if (err) {
          return callback(createErrorResponse(err));
        }
        callback(createOkResponse({ product: productSaved }));
      });
    });
  };

  getProducts = ({ query }, callback) => {
    const from = Number(query.from || 0);
    Product.find({ disponible: true })
      .skip(from)
      .limit(5)
      .populate("usuario", "nombre email")
      .populate("categoria", "description")
      .exec((err, productsDB) => {
        if (err || !productsDB) {
          callback(createErrorResponse(err));
          return;
        }
        callback(createOkResponse({ productsDB }));
      });
  };

  getProductById = ({ params: { id } }, callback) => {
    Product.findById(id)
      .populate("usuario", "nombre mail")
      .populate("categoria", "description")
      .exec((err, productDB) => {
        if (err) {
          return callback(createErrorResponse(err));
        }
        callback(createOkResponse({ productDB }));
      });
  };

  deleteProduct = ({ params: { id } }, callback) => {
    const changeState = {
      disponible: false,
    };
    Product.findByIdAndUpdate(
      id,
      changeState,
      { new: true },
      (err, productDB) => {
        if (err) {
          return callback(createErrorResponse(err));
        }
        if (!productDB) {
          return callback(createErrorResponse({ message: "Id not exist" }));
        }
        callback(createOkResponse({ productDB }));
      }
    );
  };

  searchProduct = ({ params: { query } }, callback) => {
    const regex = new RegExp(query, "i");
    Product.find({ nombre: regex })
      .populate("categoria", "nombre")
      .exec((err, productsDB) => {
        if (err) {
          return callback(createErrorResponse(err));
        }
        if (!productsDB) {
          return callback(
            createErrorResponse({ message: "Product not found" })
          );
        }
        callback(createOkResponse({ productsDB }));
      });
  };
}

module.exports = ProductService;

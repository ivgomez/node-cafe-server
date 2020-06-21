const { createOkResponse, createErrorResponse } = require("../utils/responseBuilder");
const User = require("../schemas/usuarioSchema");
const Product = require("../schemas/productSchema");

const fs = require("fs");
const path = require("path");

class UploadService {
  constructor() {}

  deleteFile = (fileName, collectionType) => {
    const fileURL = path.resolve(__dirname, `../../uploads/${collectionType}/${fileName}`);
    if (fs.existsSync(fileURL)) fs.unlinkSync(fileURL);
  };

  saveFiles = (id, fileName, collectionType, callback) => {
    const Collection = collectionType === "users" ? User : Product;
    Collection.findById(id, (err, responseDB) => {
      if (err) {
        this.deleteFile(fileName, collectionType);
        callback(createErrorResponse(err));
        return;
      }
      if (!responseDB) {
        this.deleteFile(fileName, collectionType);
        callback(createErrorResponse({ message: "Not found" }));
        return;
      }
      this.deleteFile(responseDB.img, collectionType);
      responseDB.img = fileName;
      responseDB.save((err, dataSaved) => {
        if (err) return callback(createErrorResponse(err));
        callback(createOkResponse({ [collectionType]: dataSaved, img: fileName }));
      });
    });
  };

  uploadFile = ({ files, params: { collectionType, id } }, callback) => {
    // type validation
    const validType = ["products", "users"];
    if (validType.indexOf(collectionType) < 0)
      return callback(createErrorResponse({ message: "Invalid collectionType" }));
    if (!files || Object.keys(files).length === 0)
      return callback(createErrorResponse({ message: "No files were uploaded." }));

    const file = files.fileloaded;
    // valid extentions
    const validExt = ["png", "jpg", "gif", "jpeg"];
    // file extension
    const fileExt = file.name.split(".")[1].toLowerCase();

    if (validExt.indexOf(fileExt) < 0)
      return callback(createErrorResponse({ message: "Invalid extenstion file" }));

    // file name
    const fileName = `${id}-${new Date().getMilliseconds()}.${fileExt}`;
    // Use the mv() method to place the file somewhere on your server
    file.mv(`uploads/${collectionType}/${fileName}`, (err) => {
      if (err) return callback(createErrorResponse(err));
      this.saveFiles(id, fileName, collectionType, callback);
      createOkResponse({ message: "file uploaded succesfully" });
    });
  };
}

module.exports = UploadService;

const { createOkResponse, createErrorResponse } = require("../utils/responseBuilder");
const User = require("../schemas/usuarioSchema");

const fs = require("fs");
const path = require("path");

class UploadService {
  constructor() {}

  deleteFile = (fileName, collectionType) => {
    const fileURL = path.resolve(__dirname, `../../uploads/${collectionType}/${fileName}`);
    if (fs.existsSync(fileURL)) fs.unlinkSync(fileURL);
  };

  saveUserImage = (id, fileName, collectionType, callback) => {
    User.findById(id, (err, userDB) => {
      if (err) {
        this.deleteFile(fileName, collectionType);
        callback(createErrorResponse(err));
        return;
      }
      if (!userDB) {
        this.deleteFile(fileName, collectionType);
        callback(createErrorResponse({ message: "Not found" }));
        return;
      }
      this.deleteFile(userDB.img, collectionType);
      userDB.img = fileName;
      userDB.save((err, userSaved) => {
        if (err) return callback(createErrorResponse(err));
        callback(createOkResponse({ user: userSaved, img: fileName }));
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
      this.saveUserImage(id, fileName, collectionType, callback);
      createOkResponse({ message: "file uploaded succesfully" });
    });
  };
}

module.exports = UploadService;

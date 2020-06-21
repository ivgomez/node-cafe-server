const { createOkResponse, createErrorResponse } = require("../utils/responseBuilder");
const path = require("path");
const fs = require("fs");

class ImageService {
  constructor() {}
  getImage = ({ params: { collectionType, img } }, res) => {
    const pathImage = path.resolve(__dirname, `../../uploads/${collectionType}/${img}`);
    const noImagePath = path.resolve(__dirname, "../assets/original.jpg");

    if (fs.existsSync(pathImage)) {
      res.sendFile(pathImage);
    } else {
      res.sendFile(noImagePath);
    }
  };
}

module.exports = ImageService;

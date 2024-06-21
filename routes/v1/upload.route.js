const express = require("express");
const router = express.Router();
const upload = require("../../middleware/uploadMiddleware");
const uploadController = require("../../controllers/upload.controller");

router
  .route("/product-images")
  .post(upload.array("files", 5), uploadController.uploadMultipleImages);

router
  .route("/singleImage")
  .post(upload.single("image"), uploadController.uploadSingleImage);
module.exports = router;

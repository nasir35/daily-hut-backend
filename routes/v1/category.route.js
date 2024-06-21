const express = require("express");
const categoryController = require("../../controllers/category.controller");
const verifyAdminOrSupplier = require("../../middleware/verifyAdminOrSupplier");
const verifyObjectId = require("../../middleware/verifyObjectId");
const router = express.Router();

router
  .route("/subcategories/:categoryId")
  .get(categoryController.getSubCategories);
router
  .route("/")
  .get(categoryController.getAllCategory)
  .post(verifyAdminOrSupplier, categoryController.addACategory);
router
  .route("/:id")
  .get(verifyObjectId, categoryController.getCategoryWithId)
  .patch(verifyAdminOrSupplier, categoryController.editACategory)
  .delete(verifyAdminOrSupplier, categoryController.deleteACategory);
module.exports = router;

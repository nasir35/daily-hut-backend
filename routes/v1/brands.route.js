const express = require("express");
const brandsController = require("../../controllers/brands.controller");
const verifyAdminOrSupplier = require("../../middleware/verifyAdminOrSupplier");
const router = express.Router();
router
  .route("/")
  .get(brandsController.getAllBrands)
  .post(verifyAdminOrSupplier, brandsController.addABrand);
router
  .route("/:id")
  .patch(verifyAdminOrSupplier, brandsController.editABrand)
  .delete(verifyAdminOrSupplier, brandsController.deleteABrand);
module.exports = router;

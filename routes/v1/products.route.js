const express = require("express");
const productsController = require("../../controllers/product.controller");
const verifyObjectId = require("../../middleware/verifyObjectId");
const verifyAdminOrSupplier = require("../../middleware/verifyAdminOrSupplier");
const router = express.Router();

router.route("/search-products").get(productsController.searchProducts);

router
  .route("/")
  .get(productsController.getAllProducts)
  .post(verifyAdminOrSupplier, productsController.saveAProduct);

router
  .route("/:id")
  .get(verifyObjectId, productsController.getProductById)
  .patch(verifyAdminOrSupplier, verifyObjectId, productsController.editAProduct)
  .delete(
    verifyAdminOrSupplier,
    verifyObjectId,
    productsController.deleteAProduct
  );

module.exports = router;

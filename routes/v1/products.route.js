const express = require("express");
const { verifyToken } = require("../../middleware/jwtToken");
const productsController = require("../../controllers/product.controller");
const verifyObjectId = require("../../middleware/verifyObjectId");
const verifyAdminOrSupplier = require("../../middleware/verifyAdminOrSupplier");
const router = express.Router();

router.route("/search-products").get(productsController.searchProducts);

router
  .route("/")
  .get(productsController.getAllProducts)
  .post(verifyToken, verifyAdminOrSupplier, productsController.saveAProduct);

router
  .route("/:id")
  .get(verifyObjectId, productsController.getProductById)
  .patch(
    verifyToken,
    verifyAdminOrSupplier,
    verifyObjectId,
    productsController.editAProduct
  )
  .delete(
    verifyToken,
    verifyAdminOrSupplier,
    verifyObjectId,
    productsController.deleteAProduct
  );

module.exports = router;

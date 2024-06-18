const express = require("express");
const { verifyToken } = require("../../middleware/jwtToken");
const cartController = require("../../controllers/cart.controller");
const router = express.Router();
router
  .route("/")
  .get(verifyToken, cartController.getCart)
  .post(verifyToken, cartController.addToCart)
  .patch(verifyToken, cartController.editCart);

router.route("/is-cart-exist/").get(verifyToken, cartController.checkIfExist);

module.exports = router;

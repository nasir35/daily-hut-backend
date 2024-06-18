const express = require("express");
const { verifyToken } = require("../../middleware/jwtToken");
const usersController = require("../../controllers/users.controller");
const verifyAdmin = require("../../middleware/verifyAdmin");
const verifyObjectId = require("../../middleware/verifyObjectId");
const router = express.Router();
router
  .route("/")
  .get(verifyToken, verifyAdmin, usersController.getAllUsers)
  .post(usersController.saveAnUser);
router
  .route("/users-count")
  .get(verifyToken, verifyAdmin, usersController.getUsersCount);
router
  .route("/get-with-id/:id")
  .get(verifyObjectId, usersController.getUserWithId);
router
  .route("/get-with-email/:email")
  .get(usersController.getUserWithEmail)
  .patch(verifyToken, usersController.updateUserWithEmail);

module.exports = router;

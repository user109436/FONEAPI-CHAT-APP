const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

router.route("/identify-user").post(userController.identifyUserByJWT);

// API prefix is located at app.js
router.use(authController.protect);
router.route("/").post(userController.createUser).get(userController.getUsers);

router
  .route("/:id")
  .patch(userController.updateUser)
  .get(userController.getUser)
  .delete(userController.deleteUser);

module.exports = router;

const express = require("express");
const router = express.Router();
const chatRoomController = require("../controllers/chatRoomController");
const authController = require("../controllers/authController");

// API prefix is located at app.js
router.use(authController.protect);
router
  .route("/")
  .post(chatRoomController.createChatRoom)
  .get(chatRoomController.getChatRooms);

router
  .route("/:id")
  .patch(chatRoomController.updateChatRoom)
  .get(chatRoomController.getChatRoom)
  .delete(chatRoomController.deleteChatRoom);

module.exports = router;

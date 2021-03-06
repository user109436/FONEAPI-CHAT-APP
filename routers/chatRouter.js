const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const authController = require("../controllers/authController");

// API prefix is located at app.js
router.use(authController.protect);
router.route("/").post(chatController.createChat).get(chatController.getChats);

router
  .route("/:id")
  .patch(chatController.updateChat)
  .get(chatController.getChat)
  .delete(chatController.deleteChat);

router
  .route("/chatroom/:id") //id of chatroom
  .get(chatController.getChatRoomMessages)
  .post(chatController.sendMessage)
  .patch(chatController.messageSeen);

module.exports = router;

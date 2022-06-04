const factory = require("./handlerFactory");
const ChatRoom = require("../models/chatRoomModel");
const catchAsync = require("../utils/catchAsync");

//CRUD
exports.createChatRoom = factory.createOne(ChatRoom);
exports.getChatRooms = factory.getAll(ChatRoom);
exports.getChatRoom = factory.getOne(ChatRoom);
exports.updateChatRoom = factory.updateOne(ChatRoom);
exports.deleteChatRoom = factory.deleteOne(ChatRoom);

//unique query operations
exports.getUserChatRooms = catchAsync(async (req, res, next) => {
  console.log("id:", req.params.id);
  const doc = await ChatRoom.find({
    users: {
      $in: [req.params.id],
    },
  }).sort({ updatedAt: -1 });
  if (!doc) {
    return res.status(200).json({
      status: "success",
      message: "No History of Chat Conversation",
    });
  }
  return res.status(200).json({
    status: "success",
    length: doc.length,
    doc,
  });
});

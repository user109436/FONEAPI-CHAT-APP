const factory = require("./handlerFactory");
const Chat = require("../models/chatModel");
const ChatRoom = require("../models/chatRoomModel");
const catchAsync = require("../utils/catchAsync");

//CRUD
exports.createChat = factory.createOne(Chat);
exports.getChats = factory.getAll(Chat);
exports.getChat = factory.getOne(Chat);
exports.updateChat = factory.updateOne(Chat);
exports.deleteChat = factory.deleteOne(Chat);

//unique query operations
exports.getChatRoomMessages = catchAsync(async (req, res, next) => {
  const doc = await Chat.find({ chatRoom: req.params.id });
  if (!doc) {
    return res.status(200).json({
      status: "success",
      message: "No History of Messages",
    });
  }
  return res.status(200).json({
    status: "success",
    length: doc.length,
    doc,
  });
});
//automatically save the login user_id as sender and seen
exports.sendMessage = catchAsync(async (req, res, next) => {
  //post on chatroom id
  const messageToSend = {
    chatRoom: req.params.id,
    message: req.body.message,
    files: req.body.images || [],
    seenBy: [res.locals.user._id],
    sender: res.locals.user._id,
  };

  const message = await Chat.create(messageToSend);
  if (!message) {
    return res.status(400).json({
      message: "Failed to Save Message",
    });
  }

  //update chatRoom
  const lastMessage = await ChatRoom.findByIdAndUpdate(req.params.id, {
    lastMessage: message._id,
  });
  this.getChatRoomMessages(req, res, next);
});

//upon clicking on chatRoom user will automatically "seen" all the messages
exports.messageSeen = catchAsync(async (req, res, next) => {
  const doc = await Chat.updateMany(
    {
      seenBy: {
        $nin: [res.locals.user._id],
      },
    },
    {
      $push: { seenBy: res.locals.user._id },
    }
  );
  res.status(200).json({
    status: "success",
    length: doc.length,
    doc,
  });
});

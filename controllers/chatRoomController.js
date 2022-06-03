const factory = require("./handlerFactory");
const ChatRoom = require("../models/chatRoomModel");

//CRUD
exports.createChatRoom = factory.createOne(ChatRoom);
exports.getChatRooms = factory.getAll(ChatRoom);
exports.getChatRoom = factory.getOne(ChatRoom);
exports.updateChatRoom = factory.updateOne(ChatRoom);
exports.deleteChatRoom = factory.deleteOne(ChatRoom);

//unique query operations

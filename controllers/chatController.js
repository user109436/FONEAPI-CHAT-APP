const factory = require("./handlerFactory");
const Chat = require("../models/chatModel");

//CRUD
exports.createChat = factory.createOne(Chat);
exports.getChats = factory.getAll(Chat);
exports.getChat = factory.getOne(Chat);
exports.updateChat = factory.updateOne(Chat);
exports.deleteChat = factory.deleteOne(Chat);

//unique query operations

const factory = require("./handlerFactory");
const User = require("../models/userModel");

//CRUD
exports.createUser = factory.createOne(User);
exports.getUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

//unique query operations

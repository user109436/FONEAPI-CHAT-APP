const { promisify } = require("util");
const factory = require("./handlerFactory");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
//CRUD
exports.createUser = factory.createOne(User);
exports.getUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

//unique query operations
exports.identifyUserByJWT = catchAsync(async (req, res, next) => {
  const decoded = await promisify(jwt.verify)(
    req.body.token,
    process.env.JWT_SECRET
  );
  const doc = await User.findOne({ _id: decoded.id });
  if (!doc) {
    //log out user
    return res.status(401).json({
      status: "fail",
      message: "Token Malformed",
    });
  }
  return res.status(200).json({
    status: "success",
    doc,
  });
});

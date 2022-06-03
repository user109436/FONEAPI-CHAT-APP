const catchAsync = require("../utils/catchAsync");

//delete
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return res.status(400).json({
        status: "fail",
        message: `Can't Delete document with that ID`,
      });
    }
    res.status(204).json({
      status: "success",
      message: "Succesfully Deleted",
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    if (!doc) {
      return res.status(400).json({
        status: "fail",
        message: "Document Creation Failed, Please Try Again Later",
      });
    }
    res.status(200).json({
      status: "success",
      doc,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).sort({ updatedAt: -1 }); //sort from the last updated data
    if (!doc) {
      return res.status(400).json({
        status: "fail",
        message: `Can't Update Document with that ID`,
      });
    }
    res.status(201).json({
      status: "success",
      doc,
    });
  });

exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) {
      return res.status(400).json({
        status: "fail",
        message: `No Document found with that ID`,
      });
    }
    res.status(200).json({
      status: "success",
      doc,
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.find().sort({ updatedAt: -1 });
    res.status(200).json({
      status: "success",
      length: doc.length,
      doc,
    });
  });

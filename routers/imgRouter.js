const express = require("express");
const imgController = require("../controllers/imgController");
const router = express.Router();

router.route("/:key").get(imgController.getFileFromAWS);
module.exports = router;

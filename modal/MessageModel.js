/** @format */

const mongoose = require("mongoose");

const MModel = mongoose.Schema({
  Receiver: String,
  Sender: String,
  Message: [],
});
const MsgModel = mongoose.model("Messages", MModel);
module.exports = MsgModel;

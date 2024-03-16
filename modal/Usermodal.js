/** @format */

const mongoose = require("mongoose");
const Usermodal = new mongoose.Schema(
  {
    UserName: String,
    Password: String,
    firstname: String,
    SocketId: String,
    friendsList: [{}],
    profileImg: String,
    messages: {
      Receivemsg: [
        {
          from: String,
          Receivemessage: String,
        },
      ],

      sendmsg: [
        {
          to: String,
          sendMessages: String,
        },
      ],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", Usermodal);

module.exports = User;

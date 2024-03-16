/** @format */

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http");
const multer = require("multer");
const jwt = require("jsonwebtoken");
app.use(bodyParser.json());

// const Messagemodel = require("./modal/MessageModel");
// U4TpJDhyyFUGlGXI
const UserModel = require("./modal/Usermodal");
mongoose
  .connect(
    "mongodb+srv://jeyaprakashp431:U4TpJDhyyFUGlGXI@chat-app.onsf7hy.mongodb.net/?retryWrites=true&w=majority&appName=chat-app"
  )
  .then(() => console.log("sucessfull"))
  .catch((err) => console.log(err));
// save the user data to database

app.post("/user", async (req, res) => {
  try {
    const user = new UserModel({
      UserName: req.body.userName,
      Password: req.body.Password,
      firstname: req.body.firstname,
      SocketId: req.body.socketId,
    });

    user.save();
    res.send(user);
  } catch (err) {
    console.log("error at save to databse");
  }
});
// get current user
app.post("/currentuser", async (req, res) => {
  try {
    const { UserId } = req.body;
    const user = await UserModel.findById(UserId);
    if (user) {
      res.send(user);
    }
  } catch (err) {
    console.log(err);
  }
});
// get the user name from database for validating
app.post("/login", async (req, res) => {
  try {
    const { UserName, Password } = req.body;
    const user = await UserModel.findOne({ UserName, Password });
    if (user) {
      const token = jwt.sign({ userId: user._id }, "%$46463#^475$%462&^8", {
        expiresIn: "1h",
      });
      res.send({ user, token });
      // console.log(user);
    }
  } catch (err) {
    res.send("fail");
  }
});
// get all user for search filtering
app.post("/getuser", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.send(users);
    // console.log(users);
  } catch (err) {
    console.log(err);
  }
});
// add the friends list
app.post("/addfriends", async (req, res) => {
  const { userid, frienduser } = req.body;
  try {
    const friendusers = await UserModel.findById(frienduser);
    // console.log(friendusers);
    res.send(friendusers);
    const user = await UserModel.findById(userid);
    // console.log(user);
    if (user) {
      user.friendsList.push(friendusers);
      user.save();
    }
  } catch (err) {
    console.log(err);
  }
});

const server = http.createServer(app);
const Socket = require("socket.io");
const User = require("./modal/Usermodal");

const io = Socket(server);
// io opreations
//
io.on("connection", (socket) => {
  console.log("user connected");

  socket.on("chat", async (data) => {
    const { Receiver, Message, Sender, Time, senderId, Receivername } = data;
    const receiveuser = await UserModel.findById(Receiver);
    // console.log("selected user", Receiver);
    if (receiveuser) {
      io.to(receiveuser.SocketId).emit("msg", {
        Sender: Sender,
        Time: Time,
        Message: Message,
      });
      // console.log(receiveuser);
      // save the message and sender to receiver database
      receiveuser.messages.Receivemsg.push({
        from: Sender,
        Receivemessage: Message,
      });
      // receiveuser.save();
    }
    // save the messge details sender
    // current user
    const sender = await UserModel.findById(senderId);
    if (sender) {
      sender.messages.sendmsg.push({
        to: Receivername,
        sendMessages: Message,
      });
      // sender.save();
    }
  });
  // Update socket id
  socket.on("update-socketId", async (id) => {
    await UserModel.updateOne({ _id: id }, { SocketId: socket.id });
  });
});
// send the receiver and sender db id
app.post("/sender", async (req, res) => {
  const { senderId } = req.body;
  try {
    const senderid = await UserModel.findById(senderId);
    if (senderid) {
      res.send(senderid);
    }
  } catch (err) {
    console.log(err);
  }
});
// receiver
app.post("/receiver", async (req, res) => {
  try {
    const { receiverId } = req.body;
    const receiverid = await UserModel.findById(receiverId);
    if (receiverid) {
      res.send(receiverid);
      // console.log(receiverid);
    }
  } catch (err) {
    console.log(err);
  }
});

// io operation close
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

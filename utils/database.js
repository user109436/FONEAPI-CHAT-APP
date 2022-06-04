const fs = require("fs");
const mongoose = require("mongoose");

//uncomment it for running locally - "node database" will import fresh copy of database from dummy_data
// require("dotenv").config({ path: "../.env" });

// 1. Connect to Database

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB)
  .then(() => console.log("DB Connected Successfully"))
  .catch((err) => console.log(err));

// 2. JSON dummy data
let dir = "../dummy_data";
const loadJSON = (dir, collection_name) => {
  const data = fs.readFileSync(`${dir}/${collection_name}.json`, "utf-8");
  return JSON.parse(data);
};

const usersData = loadJSON(dir, "users");
const chatRoomsData = loadJSON(dir, "chatrooms");
const chatsData = loadJSON(dir, "chats");

// 3. MODELS
dir = "../models";
const User = require(`${dir}/userModel`);
const ChatRoom = require(`${dir}/chatRoomModel`);
const Chat = require(`${dir}/chatModel`);

// 4. IMPORT
const importData = async () => {
  try {
    //drop database
    await mongoose.connection.dropDatabase();

    //import fresh collections with dummy data
    await User.create(usersData);
    await ChatRoom.create(chatRoomsData);
    await Chat.create(chatsData);
    console.log("Data Imported");
  } catch (err) {
    console.log(err);
  }
};

importData();

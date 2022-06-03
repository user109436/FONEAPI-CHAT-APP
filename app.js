const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const globalErrorHandler = require("./controllers/errorController");
require("dotenv").config();

//CONNECT TO DATABASE
const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB)
  .then(() => console.log("DB Connected Successfully"))
  .catch((err) => console.log(err));

//ROUTERS

//Authentication
const authRouter = require("./routers/authRouter");

//Chats
const chatRouter = require("./routers/chatRouter");

//chatRoom
const chatRoomRouter = require("./routers/chatRoomRouter");

//User
const userRouter = require("./routers/userRouter");

const app = express();
//display dev env
app.use((req, res, next) => {
  console.log(`App NODE_ENV=${process.env.NODE_ENV}`);
  next();
});
app.enable("trust proxy");

const corsOptions = {
  origin: "*",
  methods: "GET,POST,DELETE,UPDATE,PUT,PATCH, OPTIONS",
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "default-src": [
        "'self'",
        "http://localhost:3003",
        "http://localhost:3001",
      ],
    },
  })
);
// const limiter = rateLimit({
//   //this will slows down dictionary attacks and brute force
//   max: 100,
//   windowMs: 60 * 60 * 1000, //1hr
//   message: "Too many request from this IP, please try again in an hour",
// });
// app.use("/api/account/login", limiter);
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
//will prevent parameter pollution
app.use(
  hpp({
    whitelist: [],
  })
);
app.use(compression());

//API ROUTES

//Authentication
app.use("/api/account", authRouter);

// Chats
app.use("/api/chats", chatRouter);

//ChatRoom
app.use("/api/chatrooms", chatRoomRouter);

//Users
app.use("/api/users", userRouter);

//STATIC FILES SERVING
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
} else {
  app.use(express.static("client/public"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "public", "index.html"));
  });
}

//handle errors
app.use(globalErrorHandler);

module.exports = app;

const express = require("express");
var cors = require("cors");
const socketIO = require("socket.io");
const http = require("http");

const port = process.env.PORT || 8000;
var app = express();

app.use(cors());

let server = http.createServer(app);
var io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["*"],
  },
});

// make connection with user from server side
io.on("connection", (socket) => {
  console.log("New user connected");

  // listen for message from user
  socket.on("createMessage", (message) => {
    console.log("message", message);
  });

  // when server disconnects from user
  socket.on("disconnect", () => {
    console.log("disconnected from user");
  });
});

app.get("/dbchange", (req, res, next) => {
  let { name } = req.query;

  if (!name) {
    name = "No Name Found";
  }
  io.emit("message", name);
  return res.json(name);
});

server.listen(port);

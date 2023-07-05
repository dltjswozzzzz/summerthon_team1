// server.js
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const port = 3000;

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// server.js (continue from step 2)
const users = {};

io.on("connection", (socket) => {
  console.log("New user connected.");

  socket.on("join", (nickname) => {
    users[socket.id] = nickname;
    io.emit("chat message", `User ${nickname} joined the chat.`);
  });

  socket.on("disconnect", () => {
    if (users[socket.id]) {
      io.emit("chat message", `User ${users[socket.id]} left the chat.`);
      delete users[socket.id];
    }
  });

  socket.on("chat message", (message) => {
    const nickname = users[socket.id];
    io.emit("chat message", `${nickname}: ${message}`);
  });
});

// server.js (continue from step 1)
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

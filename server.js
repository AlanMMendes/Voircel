import cors from "cors";
import express from "express";
import fs from "fs";
import http from "http";
import path from "path";
import { Server } from "socket.io";
import { fileURLToPath } from "url";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json());


const users = {};

io.on("connection", (socket) => {
 
  socket.on("registerUser", (name) => {
    users[socket.id] = name;
    io.emit("userList", Object.values(users));
  });

  socket.on("sendMessage", (message) => {
    const senderName = users[socket.id];
    io.emit("receiveMessage", [{
      time: new Date().toLocaleTimeString(),
      user: senderName,
      message: message,
    }]);
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
    io.emit("userList", Object.values(users));
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const messagesFilePath = path.join(__dirname, "messages.json");

const loadMessages = () => {
  if (fs.existsSync(messagesFilePath)) {
    const data = fs.readFileSync(messagesFilePath);
    if (!data) {
      return [];
    }
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error("Erro ao analisar JSON:", error);
      return [];
    }
  }

  return [];
};

const saveMessages = (messages) => {
  fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2));
};

const users = {};

io.on("connection", (socket) => {
  io.emit("receiveMessage", loadMessages());
  socket.on("registerUser", (name) => {
    users[socket.id] = name;
    io.emit("userList", Object.values(users));
  });

  socket.on("sendMessage", (message) => {
    const senderName = users[socket.id];
    const messages = loadMessages();
    messages.push({
      time: new Date().toLocaleTimeString(),
      user: senderName,
      message: message,
    });
    saveMessages(messages);
    io.emit("receiveMessage", messages);
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

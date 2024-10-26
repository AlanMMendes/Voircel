// src/Chat.js
import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:4000");

const Chat = () => {
  const [name, setName] = useState(Math.random().toString(36).slice(2));
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any>([]);
  const [userConnected, setUserConnected] = useState<any>();

  useEffect(() => {
    socket.emit("registerUser", name);
    socket.on("receiveMessage", (message: any) => {
      setMessages((prevMessages: any) => [...prevMessages, message]);
    });
    socket.on("userList", (userList) => {
      setUserConnected(userList);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("registerUser");
      socket.off("userList");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("sendMessage", message);
      setMessage("");
    }
  };

  const timeAgo = (timestamp: any) => {
    const now = Date.now();
    const seconds = Math.floor((now - timestamp) / 1000);

    if (seconds < 60) return `${seconds} segundos atrás`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutos atrás`;
    return `${Math.floor(seconds / 3600)} horas atrás`;
  };

  return (
    <div className="border h-screen flex flex-col relative">
      <div className="flex flex-row justify-start items-center border w-full">
        <h4 className="">chat</h4>
      </div>

      <div className="border flex flex-row justify-start ">
        <div className="flex flex-col justify-start items-center gap-2">
          {messages.map((msg: any, index: any) => (
            <div
              key={index}
              className="flex flex-col justify-start items-start"
            >
              <div className="flex flex-row gap-2 justify-start items-center">
                <span>{msg.name}</span>
                <span className="text-xs">{timeAgo(msg.timestamp)}</span>
              </div>
              {msg.message}
            </div>
          ))}
        </div>
      </div>

      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Digite sua mensagem"
        />
        <button onClick={sendMessage}>Enviar</button>
      </div>
    </div>
  );
};

export default Chat;

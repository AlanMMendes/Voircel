// src/Chat.js
import { useEffect, useMemo, useRef, useState } from "react";
import io from "socket.io-client";
import Members from "../Members";

const socket = io("http://localhost:4000");

const Chat = () => {
  const navRef: any = useRef(null);
  const [name, setName] = useState(Math.random().toString(36).slice(2));
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any>([]);
  const [userConnected, setUserConnected] = useState<any>();
  console.log(name)

  useMemo(() => {
    socket.emit("registerUser", name);
    socket.on("receiveMessage", (message: any) => {
      setMessages((prevMessages: any) => [...prevMessages, ...message]);
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

  useEffect(() => {
    if (navRef.current) {
      navRef.current.scrollTop = navRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className=" bg-red-500 p-4">Servidores</div>
      <div className="w-1/4 p-4">Chats</div>
      <div className="flex-1 bg-green-500 p-4">
        <div className="relative flex flex-col justify-start items-center gap-2 h-full">
          <div
            ref={navRef}
            className="w-full h-5/6 flex flex-col justify-start items-center overflow-x-auto gap-2"
          >
          
              {messages?.map((msg: any, index: any) => (
                <div
                  key={index}
                  className="w-full p-4 border border-gray-100 border-opacity-45 rounded-lg"
                >
                  <div className="flex flex-row gap-2 justify-start items-center w-full">
                    <span>{msg.user}</span>
                    <span className="text-xs">{msg.timestamp}</span>
                  </div>
                  <p className="break-words justify-start flex">
                    {msg.message}
                  </p>
                </div>
              ))}
            
          </div>

          <div className="absolute bottom-0 w-full h-1/6 flex flex-col justify-start items-center">
            <input
              type="text"
              className="w-full h-full rounded-lg"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite sua mensagem"
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />
            <button
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              className="absolute bottom-0 right-0 p-2 rounded-lg bg-blue-500 text-white"
              onClick={sendMessage}
            >
              Enviar
            </button>
          </div>
        </div>
      </div>

      <div className="bg-blue-500 p-4">
        <Members members={userConnected} />
      </div>
    </div>
  );
};

export default Chat;

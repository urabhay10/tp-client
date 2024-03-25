"use client";

import React, { useState, useEffect } from "react";
import io from "socket.io-client";

export default function Home() {
  const socket = io("http://localhost:3001");

  const [message, setMessage] = useState([]);
  const [input, setInput] = useState({ sender: "user1", message: "" });

  const handelChange = (e) => {
    setInput({ ...input, message: e.target.value });
  };

  const handelSubmit = (e) => {
    e.preventDefault();
    socket.emit("SendMessage", input);
    setMessage((x) => [input, ...x]);
    setInput({ ...input, message: "" });
  };

  useEffect(() => {

    const receiveMessageHandler = (data) => {
      setMessage((x) => [data, ...x]);
    };

    socket.on("ReceiveMessage", receiveMessageHandler);

    return () => {
      socket.off("ReceiveMessage", receiveMessageHandler);
    };
  }, []);

  //       <div className="chat chat-start">
  //         <div className="chat-bubble">
  //           It's over Anakin, <br />I have the high ground.
  //         </div>
  //       </div>
  //       <div className="chat chat-end">
  //         <div className="chat-bubble">You underestimate my power!</div>
  //       </div>

  return (
    <div className="flex justify-center h-screen w-screen">
      <div className="flex flex-col-reverse w-5/6 h-5/6 top-0 py-5 overflow-auto ">
        {message.map((element, index) => (
          <div
            key={index}
            className={`chat ${
              element.sender === "user1" ? "chat-end" : "chat-start"
            }`}
          >
            <div className="chat-bubble">{element.message}</div>
          </div>
        ))}
      </div>

      <div className="fixed w-5/6 bottom-0">
        <div className="flex justify-evenly py-5">
          <textarea
            className="textarea textarea-bordered resize-none w-5/6 h-10"
            placeholder="Text"
            value={input.message}
            onChange={(e) => {
              handelChange(e);
            }}
          ></textarea>

          <button
            className="btn btn-primary w-1/8"
            onClick={(e) => {
              handelSubmit(e);
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
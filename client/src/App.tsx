import { ChangeEvent, KeyboardEvent, useCallback, useEffect, useState } from "react";
import "./App.css";
import Bubble from "./components/Bubble/Bubble";

type Message = {
  message: string;
  sender: string;
};

function App() {
  const DEFAULT_MESSAGES: Message[] = [];

  const [messages, setMessages] = useState<Message[]>(DEFAULT_MESSAGES);
  const [message, setMessage] = useState("");
  const [id, _] = useState(JSON.stringify(Math.random()));

  const sendMessage = useCallback(async () => {
    if (!!!message) return;

    await fetch("http://localhost:5000/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ message, sender: id, updated_at: Math.floor(new Date().getTime() / 1000) }),
    }).catch((error) => console.log(error));

    setMessage("");
  }, [message, id]);

  const onTextInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  }, []);

  const onTextInputKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") sendMessage();
    },
    [sendMessage]
  );

  const pollMessages = useCallback(async (updatedAt: number) => {
    fetch(`http://localhost:5000/poll?u=${updatedAt}`)
      .then((response) => {
        if (response.status === 502) return null;
        return response.json();
      })
      .then((data) => {
        if (!!data) {
          setMessages(data.messages);
          return pollMessages(data.updated_at);
        }
        return pollMessages(updatedAt);
      });
  }, []);

  useEffect(() => {
    (async () => {
      await pollMessages(0);
    })().catch(() => {
      console.log("error");
    });
  }, []);

  return (
    <div className="container">
      <div className="chat">
        <p>Your ID: {id}</p>
        {messages.map((message, index) => {
          return (
            <Bubble key={index} message={message.message} sender={message.sender} isSender={message.sender === id} />
          );
        })}
      </div>
      <div className="text-input">
        <input
          type="text"
          placeholder="Type something..."
          value={message}
          onChange={onTextInputChange}
          onKeyDown={onTextInputKeyDown}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;

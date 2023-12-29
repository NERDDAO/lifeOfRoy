import React, { useState } from "react";
import { useGlobalState } from "~~/services/store/store";
import type { NftData } from "~~/types/appTypes";

const ChatWithCaptain: React.FC = () => {
  const [chatLog, setChatLog] = useState<string[]>([]);
  const [userMessage, setUserMessage] = useState<string>("");

  const handleUserMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserMessage(event.target.value);
  };
  const state = useGlobalState(state => state);

  const handleSendMessage = async () => {
    try {
      const response = await fetch("/api/chatWithCaptain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      let captainResponse = "";
      reader?.read().then(function processText({ done, value }) {
        if (done) {
          setChatLog([...chatLog, userMessage, captainResponse]);

          setUserMessage("");
          return;
        }

        captainResponse += decoder.decode(value, { stream: true });
        reader?.read().then(processText);
        console.log(captainResponse, response);
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="relative top-0 left-0">
      <button className="relative" onClick={handleSendMessage}>
        <span className="" style={{ color: "white" }}>
          Send
        </span>
      </button>

      <div className="hex-prompt p-5">
        {chatLog.map((message, index) => (
          <div key={index} className={index % 2 === 0 ? "user-message" : "captain-message"}>
            {message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatWithCaptain;

{
  /*

const reader = response?.body?.getReader();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  const stringDecodedData = new TextDecoder("utf-8").decode(value);
}
*/
}

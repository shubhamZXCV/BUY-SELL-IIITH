import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GEMINI_API_KEY = "AIzaSyCXN-VhHUo7EvHRTyDXz9y8rkqMEEq-W3o";

const Support = () => {
    const navigate = useNavigate();
    const [conversation, setConversation] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [loading, setLoading] = useState(false);

     useEffect(()=>{
        const token = localStorage.getItem("token");
        if(!token){
          navigate("/login");
          return;
        }
      },[]);
  
    const handleSendMessage = async () => {
      if (!userInput.trim()) return;
  
      // Update the conversation with the user's input
      const updatedConversation = [
        ...conversation,
        { role: "user", text: userInput },
      ];
      setConversation(updatedConversation);
      setUserInput(""); // Clear input
      setLoading(true);
  
      try {
        // Prepare the request data for the Gemini API
        const requestData = {
          contents: updatedConversation.map((msg) => ({
            parts: [{ text: msg.text }],
            role: msg.role,
          })),
        };
  
        // Make the API call
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
          }
        );
  
        if (!response.ok) {
          throw new Error(`Gemini API error: ${response.status}`);
        }
  
        const data = await response.json();
  
        // Extract the bot's reply
        const botReply =
          data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          "I'm sorry, I don't have a response.";
  
        // Add the bot's reply to the conversation
        setConversation((prev) => [
          ...prev,
          { role: "model", text: botReply },
        ]);
      } catch (error) {
        console.error("Error:", error.message);
        setConversation((prev) => [
          ...prev,
          { role: "model", text: "Something went wrong. Please try again." },
        ]);
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="bg-base-200 h-screen flex flex-col justify-center p-3">
      {/* Chat Display */}
      <div className="h-4/6 overflow-scroll p-3 bg-base-100 rounded">
        {conversation.map((msg, index) => (
          <div
            key={index}
            className={`chat ${
              msg.role === "user" ? "chat-end" : "chat-start"
            }`}
          >
            <div
              className={`chat-bubble ${
                msg.role === "user"
                  ? "chat-bubble-secondary"
                  : "chat-bubble-primary"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="chat chat-start">
            <div className="chat-bubble chat-bubble-primary">Typing...</div>
          </div>
        )}
      </div>

      {/* Input and Send Button */}
      <div className="m-auto flex items-center justify-center bg-base-100 rounded-xl p-1">
        <input
          type="text"
          placeholder="Type here"
          className="input w-full max-w-xs m-auto"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !loading) handleSendMessage();
          }}
          disabled={loading}
        />
        <button
          className="btn btn-circle btn-primary btn-md"
          onClick={handleSendMessage}
          disabled={loading}
        >
          <svg
            fill="#000000"
            width="24px"
            height="24px"
            viewBox="0 0 15 15"
            xmlns="http://www.w3.org/2000/svg"
            id="arrow"
          >
            <path d="M8.29289 2.29289C8.68342 1.90237 9.31658 1.90237 9.70711 2.29289L14.2071 6.79289C14.5976 7.18342 14.5976 7.81658 14.2071 8.20711L9.70711 12.7071C9.31658 13.0976 8.68342 13.0976 8.29289 12.7071C7.90237 12.3166 7.90237 11.6834 8.29289 11.2929L11 8.5H1.5C0.947715 8.5 0.5 8.05228 0.5 7.5C0.5 6.94772 0.947715 6.5 1.5 6.5H11L8.29289 3.70711C7.90237 3.31658 7.90237 2.68342 8.29289 2.29289Z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Support;

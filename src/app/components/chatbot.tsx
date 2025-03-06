"use client";
import { useChat } from "@ai-sdk/react";
import { useEffect } from "react";
import styles from "../page.module.css"; 

export default function Chatbot() {
  // Load messages from localStorage (client-side check)
  const storedMessages = typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("chatMessages") || "[]")
    : [];

  // Initialize chat with stored messages
  const { messages, input, handleInputChange, handleSubmit, setMessages } = useChat({
    initialMessages: storedMessages,
  });

  // Save messages to localStorage when updated
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  // Function to clear chat
  const handleClearChat = () => {
    localStorage.removeItem("chatMessages");
    setMessages([]); // Reset messages in state
  };

  return (
    <div className={styles.container}>
      <h1 style={{ color: "black", padding: "20px" }}>🤖 AI FAQ Bot | By Keith Baskerville</h1>
      <div className={styles.chatBox}>
        {/* Chatbox */}
        <div className={styles.messageContainer}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={message.role === "user" ? styles.userMessage : styles.aiMessage}
            >
              <span
                className={`${styles.messageBubble} ${
                  message.role === "user" ? styles.userBubble : styles.aiBubble
                }`}
              >
                {message.role === "user" ? "You: " : "AI: "} {message.content}
              </span>
            </div>
          ))}
        </div>

        {/* Input Field */}
        <form onSubmit={handleSubmit} className={styles.inputContainer}>
          <input
            name="prompt"
            value={input}
            onChange={handleInputChange}
            placeholder="Ask a question..."
            className={styles.inputField}
          />
          <button type="submit" className={styles.sendButton}>Send</button>
        </form>

        {/* Clear Chat Button */}
        <button onClick={handleClearChat} className={styles.clearButton}>
          Clear Chat
        </button>
      </div>
    </div>
  );
}

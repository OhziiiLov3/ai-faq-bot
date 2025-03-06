"use client";
import { useChat } from "@ai-sdk/react";
import styles from "../page.module.css"; 

export default function FAQBot() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({});
  return (
    <div className={styles.container}>
      <h1 style={{color: "black", padding: "20px"}}>🤖 AI FAQ Bot | By Keith Baskerville</h1>
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
      </div>
    </div>
  );
}


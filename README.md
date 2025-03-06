# FAQ Chatbot with Vercel AI SDK UI
### By Keith Baskerville

![FAQBOT](https://github.com/user-attachments/assets/f7fd73e7-2412-4bcb-b0f5-b44d35e0f8f7)

This a walkthrough guide on how to build an Next.js application using the App Router, TypeScript, and React to create an FAQ chatbot powered by the Vercel AI SDK UI. In this demostration you will learn how build and design an interactive chatbot with ease using the OpenAI Api. Our chatbot will be able to answer questions and as a bonus include chat message persistence via localStorage!

## Features
- AI-powered FAQ chatbot
- Chat message persistence
- Uses Vercel AI SDK with OpenAI GPT-4o-mini
- Responsive UI with Next.js and CSS modules

 ### Installation 📦
Prerequisites
- Node.js 18+
- npm or yarn

1. Create Next.js app (using App Router)

```sh
npx create-next-app@latest ai-faq-bot --typescript
cd ai-faq-bot
```
2. Install AI SDK UI dependencies 

```sh
npm install ai @ai-sdk/react @ai-sdk/openai
```

3. Create a .env.local file in your project root and add your API key.
In this tutorial we will be using and API key from OpenAI API. If you do not have an OpenAI API key you can create one [here](https://platform.openai.com/api-keys)
```sh
OPENAI_API_KEY=your_openai_api_key
```

## How It Works 🛠️
1. ### Chatbot UI
- The chatbot interface is built using React components and CSS modules.
- User input is managed via useChat from @ai-sdk/react.

2. ### AI Response Handling
- Messages are processed and sent to the AI model via Vercel AI SDK.
- The API route POST /api/chat/route.ts handles AI responses.

3. ### Message Persistence
- Messages are saved in localStorage so they persist across page refreshes.
- A "Clear Chat" button allows users to reset the conversation.

## 📜 Walkthrough of the Example
## Step 1: Create the Chat Component
We will build the user interface for the chatbot using the useChat hook from the [AI SDK UI](https://sdk.vercel.ai/docs/ai-sdk-ui/chatbot)
### Key Benefits of AI SDK
- Handles Message State Automatically: No need to manage message history or API calls manually.
- Minimal Setup: The useChat hook provides all necessary handlers and state management.
- Optimized Performance: Efficiently updates UI with minimal re-renders.

In the `page.tsx` file add the following code:

```tsx
"use client";
import { useChat } from "@ai-sdk/react";
import styles from "./page.module.css"; 

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
```

## Step 2: Create an API Route for AI Responses 
We'll use Vercel AI SDK's streamText function to communicate with OpenAI.

Within out `src/app` directories lets create `api/chat` folders. This follows Next.js App Router best practices. Next lets create a file called `route.ts` where we will add the backend code for our API response. The file path should look like this `app/api/chat/route.ts`

In our `route.ts` file add the following code: 
```ts
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";


export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai.chat("gpt-4o-mini"), 
    system: "You are a helpful assistant.",
    messages,
  });

  return result.toDataStreamResponse();
}
```
### Key Lines
- `import { openai } from "@ai-sdk/openai";`: This allows us to use OpenAI models easily.
- `streamText Function`: Handles streaming AI responses efficiently.
- Model Selection: We use gpt-4o-mini, a lightweight model optimized for cost and speed.
- API Route Structure: Follows Next.js best practices for API routes.
- Response Handling: Converts AI-generated responses into a data stream for real-time interaction.

## Step 3: Add Styling using CSS modules
Lets add some basic styling to our chatbot interface. In the page.module.css add the following code:
Please Note the styling also includes styling for our bonus feature that will enable us to clear messages we save via localstorage.

```css

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f4f4f4;
}

.chatBox {
  max-width: 500px;
  width: 100%;
  background: white;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 20px;
}

.messageContainer {
  height: 300px;
  overflow-y: auto;
  padding: 10px;
  border: 1px solid #ddd;
  background-color: #fafafa;
  border-radius: 5px;
}

.userMessage,
.aiMessage {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
}

.aiMessage {
  justify-content: flex-start;
}

.messageBubble {
  display: inline-block;
  padding: 8px 12px;
  border-radius: 8px;
}

.userBubble {
  background-color: #6200ea;
  color: white;
}

.aiBubble {
  background-color: black;
  color: white;
}

.inputContainer {
  display: flex;
  gap: 5px;
  margin-top: 10px;
}

.inputField {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.sendButton {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.clearButton {
  width: 100%;
  padding: 10px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.clearButton:hover {
  background-color: darkred;
}
```
## Step 4: Run the App 
```sh
npm run dev
```
Visit http://localhost:3000, and our chatbot should be ready to chat! 🎉

# Additional Features

## Step 5: Add Chatbot Message Persistence
### Key Updates 
1. Modify useChat to load and save messages.
2. Use localStorage 
3. Show how messages persist after refresh.
### Create Chatbot Component
Lets create a `Chatbot.jsx` to use as a UI component. 

```tsx
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
```

## ✅ Step 6: Test Message Persistence
1. Start the chatbot and send some messages.
2. Refresh the page – Messages should still be there! 🎉
3. Close and reopen browser – Messages persist.
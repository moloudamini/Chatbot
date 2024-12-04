import React, { useContext, useRef, useLayoutEffect } from "react";
import { ChatBotContext } from "../contexts/ChatBotContext";
import Picker from "@emoji-mart/react";

const ChatBot: React.FC = () => {
  // Access ChatBotcontext using useContext hook
  const chatBotContext = useContext(ChatBotContext);

  if (!chatBotContext) {
    throw new Error("ChatBot must be used within a ChatProvider");
  }

  // Destructure all necessary values and functions from the ChatBotContext
  const {
    messages,
    inputText,
    setInputText,
    sendMessage,
    chatOpen,
    setChatOpen,
    isLoading,
    darkMode,
    setDarkMode,
    menuOpen,
    setMenuOpen,
    showEmojiPicker,
    setShowEmojiPicker,
    addEmojiToInput,
    exportConversation,
    formatTimestamp,
  } = chatBotContext;

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* Chat Button: Toggles the visibility of the chat window */}
      <button
        className="chat-button"
        onClick={() => setChatOpen((prev) => !prev)}
        data-testid="chat-button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"></path>
        </svg>
      </button>

      {/* Chatbox Container: Displays the chat interface */}
      <div
        className={`chatbox ${chatOpen ? "open" : "closed"}`}
        data-testid="chatbox"
      >
        {/* Close Button: Visible only when the chat is open */}
        {chatOpen && (
          <button
            className="close-button"
            onClick={() => setChatOpen(false)}
            data-testid="close-button"
          >
            &times;
          </button>
        )}

        {/* Chatbox Heading: Contains the title and menu */}
        <div className="chatbox-heading">
          <div className="header-left">
            <h2 data-testid="chatbot-heading">Chatbot</h2>
            <p>Leave us a message</p>
          </div>
          <div className="header-right">
            <div className="menu-container" data-testid="menu-container">
              <button
                className="header-button menu-button"
                onClick={() => setMenuOpen((prev) => !prev)}
                data-testid="menu-button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                </svg>
              </button>

              {/* Dropdown Menu: Contain Dark Mode and Export Chat buttons */}
              {menuOpen && (
                <div className="dropdown-menu" data-testid="dropdown-menu">
                  <button
                    className="dropdown-item"
                    onClick={() => setDarkMode((prev) => !prev)}
                    data-testid="dark-mode-toggle"
                  >
                    {darkMode ? "Light Mode" : "Dark Mode"}
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={exportConversation}
                    data-testid="export-button"
                  >
                    Export Chat
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat Messages Container: Displays all chat messages */}
        <div
          id="messages"
          className="chat-messages"
          data-testid="chat-messages"
        >
          {messages.map((msg, idx) => (
            <div key={idx}>
              <div
                className={`message-container ${
                  msg.sender === "bot" ? "bot" : "user"
                }`}
                data-testid={`message-${msg.sender}-${idx}`}
              >
                {msg.sender === "bot" && (
                  <img
                    src="https://cdn.icon-icons.com/icons2/1371/PNG/512/robot02_90810.png"
                    alt="Bot avatar"
                    className="message-avatar bot"
                    data-testid="bot-avatar"
                  />
                )}
                <div
                  className={`message-content ${
                    msg.sender === "bot" ? "bot" : "user"
                  }`}
                  data-testid={`message-content-${msg.sender}-${idx}`}
                >
                  <span
                    className={`message-text ${
                      msg.sender === "bot" ? "bot" : "user"
                    }`}
                    data-testid={`message-text-${msg.sender}-${idx}`}
                  >
                    {msg.text}
                  </span>
                  <span
                    className="message-timestamp"
                    data-testid="message-timestamp"
                  >
                    {formatTimestamp(msg.timestamp)}
                  </span>
                </div>
                {msg.sender === "user" && (
                  <img
                    src="https://i.pravatar.cc/100?img=1"
                    alt="User avatar"
                    className="message-avatar user"
                    data-testid="user-avatar"
                  />
                )}
              </div>
            </div>
          ))}

          {/* Loading Indicator: Displayed when the bot is processing a response */}
          {isLoading && (
            <div
              className="message-container bot"
              data-testid="loading-indicator"
            >
              <img
                src="https://cdn.icon-icons.com/icons2/1371/PNG/512/robot02_90810.png"
                alt="Bot avatar"
                className="message-avatar bot"
                data-testid="bot-avatar-loading"
              />
              <div className="message-content bot">
                <div
                  className="typing-indicator"
                  data-testid="typing-indicator"
                >
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Container: Contains the input field and send button and emoji */}
        <div
          className="chat-input-container"
          data-testid="chat-input-container"
        >
          <form
            className="chat-form"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            data-testid="chat-form"
          >
            <input
              type="text"
              placeholder="Write a message..."
              autoComplete="off"
              autoFocus
              className="chat-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              data-testid="chat-input"
            />
            <div
              className="chat-send-button-container"
              data-testid="send-button-container"
            >
              <button
                type="button"
                className="emoji-button"
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                data-testid="emoji-button"
                style={{ marginRight: "10px" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    fill="none"
                    stroke="black"
                    strokeWidth="2"
                  />
                  <circle
                    cx="8"
                    cy="10"
                    r="1.5"
                    fill="none"
                    stroke="black"
                    strokeWidth="2"
                  />
                  <circle
                    cx="16"
                    cy="10"
                    r="1.5"
                    fill="none"
                    stroke="black"
                    strokeWidth="2"
                  />
                  <path
                    d="M8 15c1 1.5 2.5 2 4 2s3-0.5 4-2"
                    fill="none"
                    stroke="black"
                    strokeWidth="2"
                  />
                </svg>
              </button>

              {showEmojiPicker && (
                <div className="emoji-picker-container">
                  <Picker onEmojiSelect={addEmojiToInput} />
                </div>
              )}
              <button
                type="submit"
                className="chat-send-button"
                data-testid="send-button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="send-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 2L11 13"></path>
                  <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChatBot;

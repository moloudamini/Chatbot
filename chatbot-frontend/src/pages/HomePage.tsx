import React, { useContext } from "react";
import ChatBot from "../components/ChatBot";
import { ChatBotContext } from "../contexts/ChatBotContext";

const HomePage: React.FC = () => {
  // Access the ChatBotContext using useContext hook
  const chatBotContext = useContext(ChatBotContext);

  if (!chatBotContext) {
    throw new Error("HomePage must be used within a ChatProvider");
  }

  // Destructure the setChatOpen function from ChatBotContext
  const { setChatOpen } = chatBotContext;

  return (
    <div className="font-sans text-gray-900 bg-gray-100">
      {/* Hero Section*/}
      <section className="flex items-center justify-center h-screen px-3 text-center text-white hero-section">
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="hero-heading">Welcome to Your Virtual Assistant</h1>
          <p className="hero-text">
            Our chatbot provides seamless interaction and it is available
            anytime to assist you.
          </p>

          {/* Opens the chat window */}
          <button className="hero-button" onClick={() => setChatOpen(true)}>
            Try Chat Now
          </button>
        </div>
      </section>

      {/* ChatBot Component */}
      <ChatBot />

      {/* Features Section */}
      <section
        className="px-6 py-16"
        style={{ backgroundColor: "var(--light-gray)" }}
      >
        <h2
          className="mb-12 text-3xl font-bold text-center"
          style={{ color: "var(--primary-color)" }}
        >
          Key Features of Our ChatBot
        </h2>

        <div className="grid gap-8 sm:grid-cols-3 features-grid">
          <div className="features-card">
            <div className="flex justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-16 h-16 text-primary-color"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2l2.5 7.5h7.5l-6 4.5 2.5 7.5-6-4.5-6 4.5 2.5-7.5-6-4.5h7.5l2.5-7.5z" />
              </svg>
            </div>

            <h3 className="features-heading">Fast & Reliable</h3>

            <p>
              Our chatbot answers instantly, offering quick solutions to your
              questions.
            </p>
          </div>

          <div className="features-card">
            <div className="flex justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-16 h-16 text-primary-color"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 2h6v18h-6zM2 10h6v10h-6z" />
              </svg>
            </div>

            <h3 className="features-heading">Easy to Use</h3>

            <p>
              The chatbot interface is simple, intuitive, and user-friendly for
              everyone.
            </p>
          </div>

          <div className="features-card">
            <div className="flex justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-16 h-16 text-primary-color"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 1l4 4h-3v8h-2v-8h-3l4-4z" />
              </svg>
            </div>

            <h3 className="features-heading">24/7 Availability</h3>
            <p>
              Our chatbot is available at any time, ready to answer all your
              questions.
            </p>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer
        className="py-6 text-white"
        style={{ backgroundColor: "var(--primary-color)" }}
      >
        <div className="text-center">
          <p>&copy; 2024. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

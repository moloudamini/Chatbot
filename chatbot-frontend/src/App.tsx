import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { ChatBotProvider } from "./contexts/ChatBotContext";

const App: React.FC = () => {
  return (
    // ChatBotProvider provides the ChatBotContext to all child components
    <ChatBotProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </ChatBotProvider>
  );
};

export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { ChatBotProvider } from "./contexts/ChatBotContext";

const App: React.FC = () => {
  return (
    // ChatBotProvider provides the ChatBotContext to all child components
    <ChatBotProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Router>
    </ChatBotProvider>
  );
};

export default App;

import React, {
  createContext,
  useState,
  useRef,
  useEffect,
  ReactNode,
} from "react";

//Message interface
interface Message {
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

//Response interface
interface ChatResponse {
  response: string;
}

//ChatBotContextProps interface
interface ChatBotContextProps {
  messages: Message[];
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: () => void;
  chatOpen: boolean;
  setChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  showEmojiPicker: boolean;
  setShowEmojiPicker: React.Dispatch<React.SetStateAction<boolean>>;
  addEmojiToInput: (emoji: { native: string }) => void;
  exportConversation: () => void;
  formatTimestamp: (timestamp: Date) => string;
}

// Initial message from bot
const initialMessages: Message[] = [
  {
    sender: "bot",
    text: "Hello! How can I assist you today?",
    timestamp: new Date(),
  },
];

//ChatBotContext
export const ChatBotContext = createContext<ChatBotContextProps | undefined>(
  undefined
);

//ChatBotProviderProps Interface
interface ChatBotProviderProps {
  children: ReactNode;
}

// ChatBotProvider component to provide chat context to children
export const ChatBotProvider: React.FC<ChatBotProviderProps> = ({
  children,
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  //To scroll to the bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  //Toggle dark mode
  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  //To send message
  const sendMessage = async () => {
    if (!input.trim()) return;
    //User message object
    const userMessage: Message = {
      sender: "user",
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    //Prepare data to send to the API
    try {
      const formData = new FormData();
      formData.append("message", input);

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/chat`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok)
        throw new Error(`Network response was not ok: ${response.status}`);

      const data: ChatResponse = await response.json();
      const botReply: Message = {
        sender: "bot",
        text: data.response,
        timestamp: new Date(),
      };

      // Simulate typing delay before adding the bot's reply to messages (real thinking for bot)
      const typingDelay = Math.max(1000, botReply.text.length * 50);
      setTimeout(() => {
        setMessages((prev) => [...prev, botReply]);
        setIsLoading(false);
      }, typingDelay);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Sorry, something went wrong.",
          timestamp: new Date(),
        },
      ]);
      setIsLoading(false);
    }
  };

  //To handle clicks outside the menu to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".menu-container")) setMenuOpen(false);
    };

    if (menuOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [menuOpen]);

  //To format timestamps for display
  const formatTimestamp = (timestamp: Date): string => {
    const now = new Date();
    const isToday =
      timestamp.getDate() === now.getDate() &&
      timestamp.getMonth() === now.getMonth() &&
      timestamp.getFullYear() === now.getFullYear();

    const options: Intl.DateTimeFormatOptions = isToday
      ? { hour: "2-digit", minute: "2-digit", hour12: true }
      : {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        };

    return timestamp.toLocaleString([], options);
  };

  // To add an emoji
  const addEmojiToInput = (emoji: { native: string }) => {
    setInput((prevInput) => prevInput + emoji.native);
    setShowEmojiPicker(false);
  };

  // To export chat converastion as a text file
  const exportConversation = () => {
    const formatDateForFilename = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };
    //Format message
    const messageText = messages
      .map(
        (msg) =>
          `${formatTimestamp(msg.timestamp)} - ${msg.sender.toUpperCase()}: ${
            msg.text
          }`
      )
      .join("\n");

    // Create a Blob from the message text
    const blob = new Blob([messageText], { type: "text/plain" });
    const filenameDate = formatDateForFilename(new Date());
    const filename = `chat-history-${filenameDate}-${Date.now()}.txt`;

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Provide the context values to children
  return (
    <ChatBotContext.Provider
      value={{
        messages,
        input,
        setInput,
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
      }}
    >
      {children}
      <div ref={messagesEndRef} />
    </ChatBotContext.Provider>
  );
};

import { render, screen, fireEvent, waitFor } from "../tests/test-utils";
import ChatBot from "../components/ChatBot";
import fetchMock from "jest-fetch-mock";

beforeAll(() => {
  jest.spyOn(console, "warn").mockImplementation(() => {});
});

beforeEach(() => {
  jest.clearAllMocks();
  fetchMock.resetMocks();
});

describe("ChatBot Component", () => {
  test("opens the chatbox when the chat button is clicked", () => {
    render(<ChatBot />);

    const chatButton = screen.getByTestId("chat-button");
    fireEvent.click(chatButton);

    const chatBox = screen.getByTestId("chatbox");
    expect(chatBox).toHaveClass("open");
  });

  test("sends a message and receives a bot response", async () => {
    render(<ChatBot />);

    const input = screen.getByTestId("chat-input");
    fireEvent.change(input, { target: { value: "Hello" } });

    const sendButton = screen.getByTestId("send-button");
    fireEvent.click(sendButton);

    await waitFor(() => {
      const botMessage = screen.getByTestId("message-bot-2");
      expect(botMessage).toHaveTextContent("Sorry, something went wrong.");
    });
  });

  test("toggles dark mode", () => {
    render(<ChatBot />);
    const chatButton = screen.getByTestId("chat-button");
    fireEvent.click(chatButton);

    const menuButton = screen.getByTestId("menu-button");
    fireEvent.click(menuButton);

    const darkModeButton = screen.getByTestId("dark-mode-toggle");
    fireEvent.click(darkModeButton);

    expect(document.body.classList.contains("dark-mode")).toBe(true);
  });

  test("does not send message if input is empty", () => {
    render(<ChatBot />);
    const chatButton = screen.getByTestId("chat-button");
    fireEvent.click(chatButton);

    const inputField = screen.getByTestId("chat-input");
    const sendButton = screen.getByTestId("send-button");

    fireEvent.change(inputField, { target: { value: "" } });
    fireEvent.click(sendButton);

    const initialMessage = screen.getByTestId("message-bot-0");
    expect(initialMessage).toHaveTextContent(
      "Hello! How can I assist you today?"
    );
  });
});

import { render, screen, fireEvent } from "../tests/test-utils";
import HomePage from "../pages/HomePage";

test("renders Try Chat Now button", () => {
  render(<HomePage />);
  const tryChatButton = screen.getByRole("button", { name: /Try Chat Now/i });
  expect(tryChatButton).toBeInTheDocument();
});

test("renders Features section", () => {
  render(<HomePage />);
  const featuresSection = screen.getByText(/Key Features of Our ChatBot/i);
  expect(featuresSection).toBeInTheDocument();
});

test("renders Fast & Reliable feature", () => {
  render(<HomePage />);
  const fastReliableFeature = screen.getByText(/Fast & Reliable/i);
  expect(fastReliableFeature).toBeInTheDocument();
});

test("renders Easy to Use feature", () => {
  render(<HomePage />);
  const easyToUseFeature = screen.getByText(/Easy to Use/i);
  expect(easyToUseFeature).toBeInTheDocument();
});

test("renders 24/7 Availability feature", () => {
  render(<HomePage />);
  const availabilityFeature = screen.getByText(/24\/7 Availability/i);
  expect(availabilityFeature).toBeInTheDocument();
});

test("renders footer text", () => {
  render(<HomePage />);
  const footerText = screen.getByText(/© 2024. All rights reserved./i);
  expect(footerText).toBeInTheDocument();
});

test("opens chat when 'Try Chat Now' button is clicked", () => {
  render(<HomePage />);

  const tryChatButton = screen.getByRole("button", { name: /Try Chat Now/i });
  fireEvent.click(tryChatButton);

  const chatBox = screen.getByTestId("chatbox");
  expect(chatBox).toHaveClass("open");
});

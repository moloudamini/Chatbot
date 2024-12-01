import { ReactElement, ReactNode } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { ChatBotProvider } from "../contexts/ChatBotContext";

interface WrapperProps {
  children: ReactNode;
}

// Custom render function for ChatBotProvider
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => {
  const Wrapper = ({ children }: WrapperProps) => (
    <ChatBotProvider>{children}</ChatBotProvider>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};

export * from "@testing-library/react";
export { customRender as render };

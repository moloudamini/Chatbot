import { render, screen } from "@testing-library/react";
import App from "../App";

test("renders HomePage at the root route", () => {
  render(<App />);

  const homePageTitle = screen.getByText(/Welcome to Your Virtual Assistant/i);
  expect(homePageTitle).toBeInTheDocument();
});

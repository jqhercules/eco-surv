import { describe, beforeEach, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import App, { IData } from "./App";

describe("App", () => {
  beforeEach(() => {
    // Mock API in useEffect, workaround
    global.fetch = vi.fn().mockImplementationOnce(() =>
      Promise.resolve({
        status: 400,
        json: () =>
          Promise.resolve({ success: false, error: "Something bad happened" }),
      })
    );
  });

  it("renders the App component", async () => {
    //Arrange
    render(<App />);

    // Act
    const appElement = screen.getByTestId("app");

    // Assert
    expect(appElement).toBeInTheDocument();
  });

  it("renders the breed dropdown with options", async () => {
    render(<App />);

    // Wait for the initial API call to complete and populate the breed dropdown
    await screen.findByTestId("breed");

    const breedDropdown = screen.getByTestId("breed");
    expect(breedDropdown).toBeInTheDocument();
    expect(breedDropdown).toHaveValue("");

    const breedOptions = screen.getAllByRole("option");
    expect(breedOptions).toHaveLength(21); // initial "Select a breed" option
    expect(breedOptions[0]).toHaveValue("");
    expect(breedOptions[0]).toHaveTextContent("Select a breed");
  });

  it("displays a warning message if no breed is selected", async () => {
    render(<App />);

    // Wait for the initial API call to complete and populate the breed dropdown
    await screen.findByTestId("breed");

    const submitButton = screen.getByRole("button", { name: "View images" });
    fireEvent.click(submitButton);

    const warningMessage = await screen.findByText("Please select a breed");
    expect(warningMessage).toBeInTheDocument();
  });
});

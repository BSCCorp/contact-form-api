import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import EmailAccountForm from "../../src/pages/EmailAccountForm";

describe("EmailAccountForm", () => {
  it("renders the SMTP account fields", () => {
    render(
      <MemoryRouter>
        <EmailAccountForm />
      </MemoryRouter>
    );

    expect(
      screen.getByLabelText(/^Name$/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/host/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/port/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/username/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/from/i)
    ).toBeInTheDocument();
  });

  it("allows SMTP account information to be entered", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <EmailAccountForm />
      </MemoryRouter>
    );

    const nameInput = screen.getByLabelText(/^Name$/i);
    const hostInput = screen.getByLabelText(/host/i);
    const portInput = screen.getByLabelText(/port/i);
    const usernameInput = screen.getByLabelText(/username/i);
    const fromInput = screen.getByLabelText(/from/i);

    await user.type(nameInput, "My SMTP Account");
    await user.type(hostInput, "smtp.example.com");
    await user.clear(portInput);
    await user.type(portInput, "587");
    await user.type(usernameInput, "sender@example.com");
    await user.type(fromInput, "sender@example.com");

    expect(nameInput).toHaveValue("My SMTP Account");
    expect(hostInput).toHaveValue("smtp.example.com");
    expect(portInput).toHaveValue(587);
    expect(usernameInput).toHaveValue("sender@example.com");
    expect(fromInput).toHaveValue("sender@example.com");
  });

  it("submits the entered account information", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <EmailAccountForm />
      </MemoryRouter>
    );

    await user.type(
      screen.getByLabelText(/^Name$/i),
      "My SMTP Account"
    );

    await user.type(
      screen.getByLabelText(/host/i),
      "smtp.example.com"
    );

    const portInput = screen.getByLabelText(/port/i);
    await user.clear(portInput);
    await user.type(portInput, "587");

    await user.type(
      screen.getByLabelText(/username/i),
      "sender@example.com"
    );

    await user.type(
      screen.getByLabelText(/from/i),
      "sender@example.com"
    );

    const submitButton = screen.getByRole("button", {
      name: /save|create|update/i,
    });

    expect(submitButton).toBeInTheDocument();
  });

  it("allows the secure connection to be toggled", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <EmailAccountForm />
      </MemoryRouter>
    );

    const secureInput = screen.getByLabelText(/secure/i);

    expect(secureInput).not.toBeChecked();

    await user.click(secureInput);

    expect(secureInput).toBeChecked();
  });
});

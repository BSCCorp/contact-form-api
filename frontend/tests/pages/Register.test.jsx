import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import Register from "../../src/pages/Register";
import { AuthProvider } from "../../src/context/AuthContext";

function renderRegister() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <Register />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe("Register", () => {
  it("renders the registration form", () => {
    renderRegister();

    expect(
      screen.getByLabelText(/name/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/email/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/password/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /register|sign up|create account/i,
      })
    ).toBeInTheDocument();
  });

  it("registers a user", async () => {
    const user = userEvent.setup();

    renderRegister();

    await user.type(
      screen.getByLabelText(/name/i),
      "Jane Doe"
    );

    await user.type(
      screen.getByLabelText(/email/i),
      "jane@example.com"
    );

    await user.type(
      screen.getByLabelText(/password/i),
      "password123"
    );

    await user.click(
      screen.getByRole("button", {
        name: /register|sign up|create account/i,
      })
    );

    expect(
      localStorage.getItem("token")
    ).toBe("test-token");
  });
});


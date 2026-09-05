import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  MemoryRouter,
  Route,
  Routes,
} from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import Register from "../../src/pages/Register";
import { useAuth } from "../../src/context/AuthContext";

vi.mock("../../src/context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

function renderRegister(initialEntries = ["/register"]) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/"
          element={<div>Dashboard page</div>}
        />

        <Route
          path="/login"
          element={<div>Login page</div>}
        />
      </Routes>
    </MemoryRouter>
  );
}

describe("Register", () => {
  it("renders the registration form", () => {
    useAuth.mockReturnValue({
      register: vi.fn(),
    });

    renderRegister();

    expect(
      screen.getByRole("heading", {
        name: "Create account",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Name")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Email")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Password")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Create account",
      })
    ).toBeInTheDocument();
  });

  it("renders the sign in link", () => {
    useAuth.mockReturnValue({
      register: vi.fn(),
    });

    renderRegister();

    expect(
      screen.getByRole("link", {
        name: "Sign in",
      })
    ).toHaveAttribute("href", "/login");
  });

  it("requires name, email, and password", () => {
    useAuth.mockReturnValue({
      register: vi.fn(),
    });

    renderRegister();

    expect(
      screen.getByLabelText("Name")
    ).toBeRequired();

    expect(
      screen.getByLabelText("Email")
    ).toBeRequired();

    expect(
      screen.getByLabelText("Password")
    ).toBeRequired();
  });

  it("updates the form fields", async () => {
    const user = userEvent.setup();

    useAuth.mockReturnValue({
      register: vi.fn(),
    });

    renderRegister();

    const name = screen.getByLabelText("Name");
    const email = screen.getByLabelText("Email");
    const password =
      screen.getByLabelText("Password");

    await user.type(name, "Jane Doe");
    await user.type(email, "jane@example.com");
    await user.type(password, "secret123");

    expect(name).toHaveValue("Jane Doe");
    expect(email).toHaveValue("jane@example.com");
    expect(password).toHaveValue("secret123");
  });

  it("calls register with the entered values", async () => {
    const user = userEvent.setup();

    const register = vi.fn().mockResolvedValue({
      user: {
        name: "Jane Doe",
        email: "jane@example.com",
      },
    });

    useAuth.mockReturnValue({
      register,
    });

    renderRegister();

    await user.type(
      screen.getByLabelText("Name"),
      "Jane Doe"
    );

    await user.type(
      screen.getByLabelText("Email"),
      "jane@example.com"
    );

    await user.type(
      screen.getByLabelText("Password"),
      "secret123"
    );

    await user.click(
      screen.getByRole("button", {
        name: "Create account",
      })
    );

    expect(register).toHaveBeenCalledWith(
      "Jane Doe",
      "jane@example.com",
      "secret123"
    );
  });

  it("navigates to the dashboard after successful registration", async () => {
    const user = userEvent.setup();

    const register = vi.fn().mockResolvedValue({
      user: {
        name: "Jane Doe",
        email: "jane@example.com",
      },
    });

    useAuth.mockReturnValue({
      register,
    });

    renderRegister();

    await user.type(
      screen.getByLabelText("Name"),
      "Jane Doe"
    );

    await user.type(
      screen.getByLabelText("Email"),
      "jane@example.com"
    );

    await user.type(
      screen.getByLabelText("Password"),
      "secret123"
    );

    await user.click(
      screen.getByRole("button", {
        name: "Create account",
      })
    );

    expect(
      await screen.findByText("Dashboard page")
    ).toBeInTheDocument();
  });

  it("displays an error when registration fails", async () => {
    const user = userEvent.setup();

    const register = vi
      .fn()
      .mockRejectedValue(
        new Error("Email is already registered")
      );

    useAuth.mockReturnValue({
      register,
    });

    renderRegister();

    await user.type(
      screen.getByLabelText("Name"),
      "Jane Doe"
    );

    await user.type(
      screen.getByLabelText("Email"),
      "jane@example.com"
    );

    await user.type(
      screen.getByLabelText("Password"),
      "secret123"
    );

    await user.click(
      screen.getByRole("button", {
        name: "Create account",
      })
    );

    expect(
      await screen.findByText(
        "Email is already registered"
      )
    ).toBeInTheDocument();
  });

  it("shows the submitting state while registration is pending", async () => {
    const user = userEvent.setup();

    let resolveRegister;

    const register = vi.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRegister = resolve;
        })
    );

    useAuth.mockReturnValue({
      register,
    });

    renderRegister();

    await user.type(
      screen.getByLabelText("Name"),
      "Jane Doe"
    );

    await user.type(
      screen.getByLabelText("Email"),
      "jane@example.com"
    );

    await user.type(
      screen.getByLabelText("Password"),
      "secret123"
    );

    const button = screen.getByRole("button", {
      name: "Create account",
    });

    await user.click(button);

    expect(
      screen.getByRole("button", {
        name: "Creating account...",
      })
    ).toBeDisabled();

    resolveRegister({
      user: {
        name: "Jane Doe",
        email: "jane@example.com",
      },
    });

    await waitFor(() => {
      expect(
        screen.queryByRole("button", {
          name: "Creating account...",
        })
      ).not.toBeInTheDocument();
    });
  });

  it("does not submit when required fields are empty", async () => {
    const user = userEvent.setup();

    const register = vi.fn();

    useAuth.mockReturnValue({
      register,
    });

    renderRegister();

    await user.click(
      screen.getByRole("button", {
        name: "Create account",
      })
    );

    expect(register).not.toHaveBeenCalled();
  });
});


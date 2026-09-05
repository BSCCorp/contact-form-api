import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  MemoryRouter,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import Layout from "../../src/components/Layout";
import { useAuth } from "../../src/context/AuthContext";

vi.mock("../../src/context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

function renderLayout() {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route element={<Layout />}>
          <Route
            path="/"
            element={<div>Dashboard page</div>}
          />

          <Route
            path="/email-accounts"
            element={
              <div>Email Accounts page</div>
            }
          />

          <Route
            path="/contact-forms"
            element={
              <div>Contact Forms page</div>
            }
          />

          <Route
            path="/login"
            element={<div>Login page</div>}
          />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe("Layout", () => {
  it("renders the application title", () => {
    useAuth.mockReturnValue({
      user: {
        name: "Jane Doe",
        email: "jane@example.com",
      },
      logout: vi.fn(),
    });

    renderLayout();

    expect(
      screen.getByRole("heading", {
        name: "Contact Forms",
      })
    ).toBeInTheDocument();
  });

  it("renders the current user's name and email", () => {
    useAuth.mockReturnValue({
      user: {
        name: "Jane Doe",
        email: "jane@example.com",
      },
      logout: vi.fn(),
    });

    renderLayout();

    expect(
      screen.getByText("Jane Doe")
    ).toBeInTheDocument();

    expect(
      screen.getByText("jane@example.com")
    ).toBeInTheDocument();
  });

  it("renders the navigation links", () => {
    useAuth.mockReturnValue({
      user: {
        name: "Jane Doe",
        email: "jane@example.com",
      },
      logout: vi.fn(),
    });

    renderLayout();

    expect(
      screen.getByRole("link", {
        name: "Dashboard",
      })
    ).toHaveAttribute("href", "/");

    expect(
      screen.getByRole("link", {
        name: "Email Accounts",
      })
    ).toHaveAttribute(
      "href",
      "/email-accounts"
    );

    expect(
      screen.getByRole("link", {
        name: "Contact Forms",
      })
    ).toHaveAttribute(
      "href",
      "/contact-forms"
    );
  });

  it("renders the current route through the outlet", () => {
    useAuth.mockReturnValue({
      user: {
        name: "Jane Doe",
        email: "jane@example.com",
      },
      logout: vi.fn(),
    });

    renderLayout();

    expect(
      screen.getByText("Dashboard page")
    ).toBeInTheDocument();
  });

  it("navigates when a navigation link is clicked", async () => {
    const user = userEvent.setup();

    useAuth.mockReturnValue({
      user: {
        name: "Jane Doe",
        email: "jane@example.com",
      },
      logout: vi.fn(),
    });

    renderLayout();

    await user.click(
      screen.getByRole("link", {
        name: "Email Accounts",
      })
    );

    expect(
      screen.getByText("Email Accounts page")
    ).toBeInTheDocument();
  });

  it("logs out and navigates to login", async () => {
    const user = userEvent.setup();
    const logout = vi.fn();

    useAuth.mockReturnValue({
      user: {
        name: "Jane Doe",
        email: "jane@example.com",
      },
      logout,
    });

    renderLayout();

    await user.click(
      screen.getByRole("button", {
        name: "Log out",
      })
    );

    expect(logout).toHaveBeenCalledTimes(1);

    expect(
      screen.getByText("Login page")
    ).toBeInTheDocument();
  });

  it("renders without a user", () => {
    useAuth.mockReturnValue({
      user: null,
      logout: vi.fn(),
    });

    renderLayout();

    expect(
      screen.getByRole("heading", {
        name: "Contact Forms",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Log out",
      })
    ).toBeInTheDocument();
  });
});

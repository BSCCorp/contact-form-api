import {
  render,
  screen,
} from "@testing-library/react";
import {
  MemoryRouter,
} from "react-router-dom";
import { vi } from "vitest";

import App from "../src/App";

vi.mock("../src/context/AuthContext", () => ({
  AuthProvider: ({ children }) => (
    <>{children}</>
  ),
}));

vi.mock("../src/components/Layout", async () => {
  const { Outlet } = await import("react-router-dom");

  return {
    default: () => (
      <div data-testid="layout">
        Layout
        <Outlet />
      </div>
    ),
  };
});

vi.mock("../src/components/ProtectedRoute", () => ({
  default: ({ children }) => children,
}));

vi.mock("../src/pages/Login", () => ({
  default: () => (
    <div>Login page</div>
  ),
}));

vi.mock("../src/pages/Register", () => ({
  default: () => (
    <div>Register page</div>
  ),
}));

vi.mock("../src/pages/Dashboard", () => ({
  default: () => (
    <div>Dashboard page</div>
  ),
}));

vi.mock("../src/pages/EmailAccounts", () => ({
  default: () => (
    <div>Email Accounts page</div>
  ),
}));

vi.mock("../src/pages/EmailAccount", () => ({
  default: () => (
    <div>Email Account page</div>
  ),
}));

vi.mock("../src/pages/ContactForms", () => ({
  default: () => (
    <div>Contact Forms page</div>
  ),
}));

vi.mock("../src/pages/ContactFormDetails", () => ({
  default: () => (
    <div>Contact Form Details page</div>
  ),
}));

function renderApp(path) {
  window.history.pushState({}, "", path);

  return render(<App />);
}

describe("App", () => {
  it("renders the login page", () => {
    renderApp("/login");

    expect(
      screen.getByText("Login page")
    ).toBeInTheDocument();
  });

  it("renders the register page", () => {
    renderApp("/register");

    expect(
      screen.getByText("Register page")
    ).toBeInTheDocument();
  });

  it("renders the dashboard for the root route", () => {
    renderApp("/");

    expect(
      screen.getByText("Dashboard page")
    ).toBeInTheDocument();

    expect(
      screen.getByTestId("layout")
    ).toBeInTheDocument();
  });

  it("renders the email accounts page", () => {
    renderApp("/email-accounts");

    expect(
      screen.getByText(
        "Email Accounts page"
      )
    ).toBeInTheDocument();
  });

  it("renders the new email account form", () => {
    renderApp("/email-accounts/new");

    expect(
      screen.getByText(
        "Email Account page"
      )
    ).toBeInTheDocument();
  });

  it("renders the edit email account form", () => {
    renderApp(
      "/email-accounts/account-1/edit"
    );

    expect(
      screen.getByText(
        "Email Account page"
      )
    ).toBeInTheDocument();
  });

  it("renders the contact forms page", () => {
    renderApp("/contact-forms");

    expect(
      screen.getByText(
        "Contact Forms page"
      )
    ).toBeInTheDocument();
  });

  it("renders contact form details", () => {
    renderApp("/contact-forms/contact-1");

    expect(
      screen.getByText(
        "Contact Form Details page"
      )
    ).toBeInTheDocument();
  });

  it("redirects an unknown route to the dashboard", async () => {
    renderApp("/this-route-does-not-exist");

    expect(
      await screen.findByText(
        "Dashboard page"
      )
    ).toBeInTheDocument();
  });
});


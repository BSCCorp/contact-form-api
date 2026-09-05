import { describe, expect, it, vi } from "vitest";
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

import EmailAccount from "../../src/pages/EmailAccount";
import * as emailAccountsApi from "../../src/api/emailAccounts";

vi.mock("../../src/api/emailAccounts", () => ({
  getEmailAccount: vi.fn(),
  createEmailAccount: vi.fn(),
  updateEmailAccount: vi.fn(),
}));

describe("EmailAccount", () => {
  it("renders the add account page", () => {
    render(
      <MemoryRouter initialEntries={["/email-accounts/new"]}>
        <Routes>
          <Route
            path="/email-accounts/new"
            element={<EmailAccount />}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", {
        name: /add email account/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/^name$/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/smtp host/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/^port$/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/^username$/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/^password$/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/from address/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/use secure smtp/i)
    ).toBeInTheDocument();
  });

  it("does not display the contact form embed when adding an account", () => {
    render(
      <MemoryRouter initialEntries={["/email-accounts/new"]}>
        <Routes>
          <Route
            path="/email-accounts/new"
            element={<EmailAccount />}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(
      screen.queryByText(/website contact form/i)
    ).not.toBeInTheDocument();
  });

  it("loads an existing account when editing", async () => {
    emailAccountsApi.getEmailAccount.mockResolvedValue({
      data: {
        _id: "account-1",
        publicId: "account-public-1",
        name: "My SMTP Account",
        host: "127.0.0.1",
        port: 1025,
        secure: false,
        username: "sender@example.com",
        from: "sender@example.com",
      },
    });

    render(
      <MemoryRouter
        initialEntries={[
          "/email-accounts/account-1/edit",
        ]}
      >
        <Routes>
          <Route
            path="/email-accounts/:id/edit"
            element={<EmailAccount />}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(
      screen.getByText(/loading/i)
    ).toBeInTheDocument();

    expect(
      await screen.findByRole("heading", {
        name: /edit email account/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/^name$/i)
    ).toHaveValue("My SMTP Account");

    expect(
      screen.getByLabelText(/smtp host/i)
    ).toHaveValue("127.0.0.1");

    expect(
      screen.getByLabelText(/^port$/i)
    ).toHaveValue(1025);

    expect(
      screen.getByLabelText(/^username$/i)
    ).toHaveValue("sender@example.com");

    expect(
      screen.getByLabelText(/from address/i)
    ).toHaveValue("sender@example.com");
  });

  it("displays the contact form embed when editing an account with a publicId", async () => {
    emailAccountsApi.getEmailAccount.mockResolvedValue({
      data: {
        _id: "account-1",
        publicId: "account-public-1",
        name: "My SMTP Account",
        host: "127.0.0.1",
        port: 1025,
        secure: false,
        username: "sender@example.com",
        from: "sender@example.com",
      },
    });

    render(
      <MemoryRouter
        initialEntries={[
          "/email-accounts/account-1/edit",
        ]}
      >
        <Routes>
          <Route
            path="/email-accounts/:id/edit"
            element={<EmailAccount />}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(
      await screen.findByText(
        /website contact form/i
      )
    ).toBeInTheDocument();
  });

  it("renders the contact form embed when editing a public email account", async () => {
    render(
      <MemoryRouter
        initialEntries={["/email-accounts/account-1/edit"]}
      >
        <Routes>
          <Route
            path="/email-accounts/:id/edit"
            element={<EmailAccount />}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(
      await screen.findByText(/Website contact form/i)
    ).toBeInTheDocument();
  });


  it("does not display the contact form embed if the account has no publicId", async () => {
    emailAccountsApi.getEmailAccount.mockResolvedValue({
      data: {
        _id: "account-1",
        name: "My SMTP Account",
        host: "127.0.0.1",
        port: 1025,
        secure: false,
        username: "sender@example.com",
        from: "sender@example.com",
      },
    });

    render(
      <MemoryRouter
        initialEntries={[
          "/email-accounts/account-1/edit",
        ]}
      >
        <Routes>
          <Route
            path="/email-accounts/:id/edit"
            element={<EmailAccount />}
          />
        </Routes>
      </MemoryRouter>
    );

    await screen.findByRole("heading", {
      name: /edit email account/i,
    });

    expect(
      screen.queryByText(/website contact form/i)
    ).not.toBeInTheDocument();
  });

  it("allows the secure SMTP option to be toggled", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/email-accounts/new"]}>
        <Routes>
          <Route
            path="/email-accounts/new"
            element={<EmailAccount />}
          />
        </Routes>
      </MemoryRouter>
    );

    const secureInput = screen.getByLabelText(
      /use secure smtp/i
    );

    expect(secureInput).not.toBeChecked();

    await user.click(secureInput);

    expect(secureInput).toBeChecked();
  });

  it("creates a new email account", async () => {
    const user = userEvent.setup();

    emailAccountsApi.createEmailAccount.mockResolvedValue({
      data: {
        _id: "account-new",
      },
    });

    render(
      <MemoryRouter initialEntries={["/email-accounts/new"]}>
        <Routes>
          <Route
            path="/email-accounts/new"
            element={<EmailAccount />}
          />
          <Route
            path="/email-accounts"
            element={<div>Email Accounts</div>}
          />
        </Routes>
      </MemoryRouter>
    );

    await user.type(
      screen.getByLabelText(/^name$/i),
      "My SMTP Account"
    );

    await user.type(
      screen.getByLabelText(/smtp host/i),
      "smtp.example.com"
    );

    const portInput = screen.getByLabelText(/^port$/i);

    await user.clear(portInput);
    await user.type(portInput, "587");

    await user.type(
      screen.getByLabelText(/^username$/i),
      "sender@example.com"
    );

    await user.type(
      screen.getByLabelText(/^password$/i),
      "secret"
    );

    await user.type(
      screen.getByLabelText(/from address/i),
      "sender@example.com"
    );

    await user.click(
      screen.getByRole("button", {
        name: /save account/i,
      })
    );

    await waitFor(() => {
      expect(
        emailAccountsApi.createEmailAccount
      ).toHaveBeenCalledWith({
        name: "My SMTP Account",
        host: "smtp.example.com",
        port: 587,
        secure: false,
        username: "sender@example.com",
        password: "secret",
        from: "sender@example.com",
      });
    });

    expect(
      await screen.findByText("Email Accounts")
    ).toBeInTheDocument();
  });

  it("updates an existing email account without sending an empty password", async () => {
    const user = userEvent.setup();

    emailAccountsApi.getEmailAccount.mockResolvedValue({
      data: {
        _id: "account-1",
        publicId: "account-public-1",
        name: "My SMTP Account",
        host: "127.0.0.1",
        port: 1025,
        secure: false,
        username: "sender@example.com",
        from: "sender@example.com",
      },
    });

    emailAccountsApi.updateEmailAccount.mockResolvedValue({
      data: {
        _id: "account-1",
      },
    });

    render(
      <MemoryRouter
        initialEntries={[
          "/email-accounts/account-1/edit",
        ]}
      >
        <Routes>
          <Route
            path="/email-accounts/:id/edit"
            element={<EmailAccount />}
          />
          <Route
            path="/email-accounts"
            element={<div>Email Accounts</div>}
          />
        </Routes>
      </MemoryRouter>
    );

    await screen.findByRole("heading", {
      name: /edit email account/i,
    });

    const nameInput = screen.getByLabelText(
      /^name$/i
    );

    await user.clear(nameInput);
    await user.type(
      nameInput,
      "Updated SMTP Account"
    );

    await user.click(
      screen.getByRole("button", {
        name: /save account/i,
      })
    );

    await waitFor(() => {
      expect(
        emailAccountsApi.updateEmailAccount
      ).toHaveBeenCalledWith(
        "account-1",
        {
          name: "Updated SMTP Account",
          host: "127.0.0.1",
          port: 1025,
          secure: false,
          username: "sender@example.com",
          from: "sender@example.com",
        }
      );
    });

    expect(
      await screen.findByText("Email Accounts")
    ).toBeInTheDocument();
  });

  it("shows an error when loading the account fails", async () => {
    emailAccountsApi.getEmailAccount.mockRejectedValue(
      new Error("Email account not found")
    );

    render(
      <MemoryRouter
        initialEntries={[
          "/email-accounts/missing/edit",
        ]}
      >
        <Routes>
          <Route
            path="/email-accounts/:id/edit"
            element={<EmailAccount />}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(
      await screen.findByText(
        "Email account not found"
      )
    ).toBeInTheDocument();
  });

  it("can cancel editing and navigate back to email accounts", async () => {
    const user = userEvent.setup();

    emailAccountsApi.getEmailAccount.mockResolvedValue({
      data: {
        _id: "account-1",
        publicId: "account-public-1",
        name: "My SMTP Account",
        host: "127.0.0.1",
        port: 1025,
        secure: false,
        username: "sender@example.com",
        from: "sender@example.com",
      },
    });

    render(
      <MemoryRouter
        initialEntries={[
          "/email-accounts/account-1/edit",
        ]}
      >
        <Routes>
          <Route
            path="/email-accounts/:id/edit"
            element={<EmailAccount />}
          />
          <Route
            path="/email-accounts"
            element={<div>Email Accounts</div>}
          />
        </Routes>
      </MemoryRouter>
    );

    await screen.findByRole("heading", {
      name: /edit email account/i,
    });

    await user.click(
      screen.getByRole("button", {
        name: /cancel/i,
      })
    );

    expect(
      await screen.findByText("Email Accounts")
    ).toBeInTheDocument();
  });
});


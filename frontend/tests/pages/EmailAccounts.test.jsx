import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import {
  MemoryRouter,
  Route,
  Routes,
} from "react-router-dom";
import { vi } from "vitest";

import EmailAccounts from "../../src/pages/EmailAccounts";
import * as emailAccountsApi from "../../src/api/emailAccounts";

vi.mock("../../src/api/emailAccounts");

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/email-accounts"]}>
      <Routes>
        <Route
          path="/email-accounts"
          element={<EmailAccounts />}
        />
        <Route
          path="/email-accounts/new"
          element={<div>New account</div>}
        />
        <Route
          path="/email-accounts/:id/edit"
          element={<div>Edit account</div>}
        />
      </Routes>
    </MemoryRouter>
  );
}

const account = {
  _id: "account-1",
  publicId: "account-public-1",
  name: "My SMTP Account",
  host: "127.0.0.1",
  port: 1025,
  secure: false,
  username: "sender@example.com",
  from: "sender@example.com",
};

describe("EmailAccounts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading initially", () => {
    emailAccountsApi.getEmailAccounts.mockReturnValue(
      new Promise(() => {})
    );

    renderPage();

    expect(
      screen.getByText("Loading...")
    ).toBeInTheDocument();
  });

  it("renders email accounts", async () => {
    emailAccountsApi.getEmailAccounts.mockResolvedValue({
      data: [account],
    });

    renderPage();

    expect(
      await screen.findByText("My SMTP Account")
    ).toBeInTheDocument();

    expect(
      screen.getByText("127.0.0.1:1025")
    ).toBeInTheDocument();

    expect(
      screen.getByText("sender@example.com")
    ).toBeInTheDocument();
  });

  it("shows the empty state", async () => {
    emailAccountsApi.getEmailAccounts.mockResolvedValue({
      data: [],
    });

    renderPage();

    expect(
      await screen.findByText(
        /no email accounts/i
      )
    ).toBeInTheDocument();
  });

  it("shows an API error", async () => {
    emailAccountsApi.getEmailAccounts.mockRejectedValue(
      new Error("Failed to load accounts")
    );

    renderPage();

    expect(
      await screen.findByText(
        "Failed to load accounts"
      )
    ).toBeInTheDocument();
  });

  it("links to add an account", async () => {
    emailAccountsApi.getEmailAccounts.mockResolvedValue({
      data: [],
    });

    renderPage();

    expect(
      await screen.findByRole("link", {
        name: /add account/i,
      })
    ).toHaveAttribute(
      "href",
      "/email-accounts/new"
    );
  });

  it("links to edit an account", async () => {
    emailAccountsApi.getEmailAccounts.mockResolvedValue({
      data: [account],
    });

    renderPage();

    expect(
      await screen.findByRole("link", {
        name: /edit/i,
      })
    ).toHaveAttribute(
      "href",
      "/email-accounts/account-1/edit"
    );
  });

  it("tests SMTP", async () => {
    emailAccountsApi.getEmailAccounts.mockResolvedValue({
      data: [account],
    });

    emailAccountsApi.testEmailAccount.mockResolvedValue({});

    const alertMock = vi
      .spyOn(window, "alert")
      .mockImplementation(() => {});

    renderPage();

    fireEvent.click(
      await screen.findByRole("button", {
        name: /test smtp/i,
      })
    );

    await waitFor(() => {
      expect(
        emailAccountsApi.testEmailAccount
      ).toHaveBeenCalledWith("account-1");

      expect(alertMock).toHaveBeenCalledWith(
        "SMTP connection successful."
      );
    });

    alertMock.mockRestore();
  });

  it("deletes an account after confirmation", async () => {
    emailAccountsApi.getEmailAccounts.mockResolvedValue({
      data: [account],
    });

    emailAccountsApi.deleteEmailAccount.mockResolvedValue(
      {}
    );

    vi.spyOn(window, "confirm").mockReturnValue(
      true
    );

    renderPage();

    fireEvent.click(
      await screen.findByRole("button", {
        name: /delete/i,
      })
    );

    await waitFor(() => {
      expect(
        emailAccountsApi.deleteEmailAccount
      ).toHaveBeenCalledWith("account-1");
    });

    expect(
      screen.queryByText("My SMTP Account")
    ).not.toBeInTheDocument();
  });
});


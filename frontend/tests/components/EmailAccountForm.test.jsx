import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import {
  render,
  screen,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import EmailAccountForm from "../../src/components/EmailAccountForm";

const existingAccount = {
  _id: "account-1",
  publicId: "account-public-1",
  name: "My SMTP Account",
  host: "127.0.0.1",
  port: 1025,
  secure: false,
  username: "sender@example.com",
  from: "sender@example.com",
};

describe("EmailAccountForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the account fields", () => {
    render(
      <EmailAccountForm
        onSubmit={vi.fn()}
      />
    );

    expect(
      screen.getByLabelText(/account name/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/smtp host/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/^port$/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/username/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/^password$/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/from address/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/use secure connection/i)
    ).toBeInTheDocument();
  });

  it("uses the supplied initial values", () => {
    render(
      <EmailAccountForm
        initialValues={existingAccount}
        onSubmit={vi.fn()}
      />
    );

    expect(
      screen.getByLabelText(/account name/i)
    ).toHaveValue("My SMTP Account");

    expect(
      screen.getByLabelText(/smtp host/i)
    ).toHaveValue("127.0.0.1");

    expect(
      screen.getByLabelText(/^port$/i)
    ).toHaveValue(1025);

    expect(
      screen.getByLabelText(/username/i)
    ).toHaveValue("sender@example.com");

    expect(
      screen.getByLabelText(/from address/i)
    ).toHaveValue("sender@example.com");
  });

  it("allows the account fields to be edited", async () => {
    const user = userEvent.setup();

    render(
      <EmailAccountForm
        onSubmit={vi.fn()}
      />
    );

    const nameInput =
      screen.getByLabelText(/account name/i);

    const hostInput =
      screen.getByLabelText(/smtp host/i);

    const portInput =
      screen.getByLabelText(/^port$/i);

    const usernameInput =
      screen.getByLabelText(/username/i);

    const passwordInput =
      screen.getByLabelText(/^password$/i);

    const fromInput =
      screen.getByLabelText(/from address/i);

    await user.type(
      nameInput,
      "My SMTP Account"
    );

    await user.type(
      hostInput,
      "smtp.example.com"
    );

    await user.clear(portInput);
    await user.type(portInput, "587");

    await user.type(
      usernameInput,
      "sender@example.com"
    );

    await user.type(
      passwordInput,
      "secret"
    );

    await user.type(
      fromInput,
      "sender@example.com"
    );

    expect(nameInput).toHaveValue(
      "My SMTP Account"
    );

    expect(hostInput).toHaveValue(
      "smtp.example.com"
    );

    expect(portInput).toHaveValue(587);

    expect(usernameInput).toHaveValue(
      "sender@example.com"
    );

    expect(passwordInput).toHaveValue(
      "secret"
    );

    expect(fromInput).toHaveValue(
      "sender@example.com"
    );
  });

  it("toggles the secure connection", async () => {
    const user = userEvent.setup();

    render(
      <EmailAccountForm
        onSubmit={vi.fn()}
      />
    );

    const secureInput =
      screen.getByLabelText(
        /use secure connection/i
      );

    expect(secureInput).not.toBeChecked();

    await user.click(secureInput);

    expect(secureInput).toBeChecked();
  });

  it("requires a password when creating an account", () => {
    render(
      <EmailAccountForm
        onSubmit={vi.fn()}
      />
    );

    expect(
      screen.getByLabelText(/^password$/i)
    ).toBeRequired();
  });

  it("does not require a password when editing an account", () => {
    render(
      <EmailAccountForm
        initialValues={existingAccount}
        onSubmit={vi.fn()}
      />
    );

    const passwordInput =
      screen.getByLabelText(/^password$/i);

    expect(passwordInput).not.toBeRequired();

    expect(passwordInput).toHaveAttribute(
      "placeholder",
      "Leave blank to keep existing password"
    );
  });

  it("submits the entered account information", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <EmailAccountForm
        onSubmit={onSubmit}
      />
    );

    await user.type(
      screen.getByLabelText(/account name/i),
      "My SMTP Account"
    );

    await user.type(
      screen.getByLabelText(/smtp host/i),
      "smtp.example.com"
    );

    const portInput =
      screen.getByLabelText(/^port$/i);

    await user.clear(portInput);
    await user.type(portInput, "587");

    await user.type(
      screen.getByLabelText(/username/i),
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

    expect(onSubmit).toHaveBeenCalledWith({
      name: "My SMTP Account",
      host: "smtp.example.com",
      port: 587,
      secure: false,
      username: "sender@example.com",
      password: "secret",
      from: "sender@example.com",
    });
  });

  it("does not submit an empty password when editing", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <EmailAccountForm
        initialValues={existingAccount}
        onSubmit={onSubmit}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: /save account/i,
      })
    );

    expect(onSubmit).toHaveBeenCalledWith({
      _id: "account-1",
      publicId: "account-public-1",
      name: "My SMTP Account",
      host: "127.0.0.1",
      port: 1025,
      secure: false,
      username: "sender@example.com",
      from: "sender@example.com",
    });

    expect(
      onSubmit.mock.calls[0][0]
    ).not.toHaveProperty("password");
  });

  it("includes a new password when editing if one is provided", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <EmailAccountForm
        initialValues={existingAccount}
        onSubmit={onSubmit}
      />
    );

    await user.type(
      screen.getByLabelText(/^password$/i),
      "new-secret"
    );

    await user.click(
      screen.getByRole("button", {
        name: /save account/i,
      })
    );

    expect(onSubmit).toHaveBeenCalledWith({
      ...existingAccount,
      password: "new-secret",
    });
  });

  it("calls onCancel when Cancel is clicked", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    render(
      <EmailAccountForm
        onSubmit={vi.fn()}
        onCancel={onCancel}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: /cancel/i,
      })
    );

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("does not render Cancel when onCancel is not provided", () => {
    render(
      <EmailAccountForm
        onSubmit={vi.fn()}
      />
    );

    expect(
      screen.queryByRole("button", {
        name: /cancel/i,
      })
    ).not.toBeInTheDocument();
  });

  it("does not render the contact form embed without a publicId", () => {
    render(
      <EmailAccountForm
        initialValues={{
          ...existingAccount,
          publicId: undefined,
        }}
        onSubmit={vi.fn()}
      />
    );

    expect(
      screen.queryByText(/website contact form/i)
    ).not.toBeInTheDocument();
  });

  it("disables the save button while submitting", () => {
    render(
      <EmailAccountForm
        onSubmit={vi.fn()}
        submitting
      />
    );

    const submitButton =
      screen.getByRole("button", {
        name: /saving/i,
      });

    expect(submitButton).toBeDisabled();
  });
});


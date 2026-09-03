import { describe, expect, it } from "vitest";

import {
  getEmailAccounts,
  getEmailAccount,
  createEmailAccount,
  updateEmailAccount,
  deleteEmailAccount,
  testEmailAccount,
} from "../../src/api/emailAccounts";

describe("email accounts API", () => {
  it("lists email accounts", async () => {
    const result = await getEmailAccounts();

    expect(result.data).toHaveLength(1);
    expect(result.data[0].name).toBe(
      "My SMTP Account"
    );
  });

  it("gets an email account", async () => {
    const result = await getEmailAccount(
      "account-1"
    );

    expect(result.data.name).toBe(
      "My SMTP Account"
    );
  });

  it("creates an email account", async () => {
    const result = await createEmailAccount({
      name: "New Account",
      host: "127.0.0.1",
      port: 1025,
      secure: false,
      username: "sender@example.com",
      password: "secret",
      from: "sender@example.com",
    });

    expect(result.data.name).toBe("New Account");
    expect(result.data.host).toBe("127.0.0.1");
  });

  it("updates an email account", async () => {
    const result = await updateEmailAccount(
      "account-1",
      {
        name: "Updated Account",
      }
    );

    expect(result.data.name).toBe(
      "Updated Account"
    );
  });

  it("deletes an email account", async () => {
    const result = await deleteEmailAccount(
      "account-1"
    );

    expect(result).toBeNull();
  });

  it("tests an SMTP account", async () => {
    const result = await testEmailAccount(
      "account-1"
    );

    expect(result.data.success).toBe(true);
    expect(result.data.message).toContain(
      "verified"
    );
  });

  it("handles a missing email account", async () => {
    await expect(
      getEmailAccount("missing")
    ).rejects.toThrow(
      "Email account not found"
    );
  });
});


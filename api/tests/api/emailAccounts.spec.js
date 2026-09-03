const {
  test,
  expect,
} = require("../fixtures/database");

const { createTestUser, } = require("../helpers/users");
const { createEmailAccount } = require("../helpers/emailAccounts.js");
const EmailAccount = require("../../src/modules/emailAccounts/emailAccount.model");
const { getEmailAccountForSending, } = require("../../src/modules/emailAccounts/emailAccount.service.js");

test.describe("Email Accounts API", () => {
  test.describe("authentication", () => {
    test("rejects creating an email account without authentication", async ({
      request,
    }) => {
      const response = await request.post("/api/email-accounts", {
        data: {
          name: "Test",
          host: "127.0.0.1",
          port: 1025,
          secure: false,
          username: "sender@example.com",
          password: "password",
          from: "sender@example.com",
        },
      });

      expect(response.status()).toBe(401);
    });

    test("rejects listing email accounts without authentication", async ({
      request,
    }) => {
      const response = await request.get(
        "/api/email-accounts"
      );

      expect(response.status()).toBe(401);
    });

    test("rejects retrieving an email account without authentication", async ({
      request,
    }) => {
      const response = await request.get(
        "/api/email-accounts/507f1f77bcf86cd799439011"
      );

      expect(response.status()).toBe(401);
    });

    test("rejects updating an email account without authentication", async ({
      request,
    }) => {
      const response = await request.put(
        "/api/email-accounts/507f1f77bcf86cd799439011",
        {
          data: {
            name: "Updated",
          },
        }
      );

      expect(response.status()).toBe(401);
    });

    test("rejects deleting an email account without authentication", async ({
      request,
    }) => {
      const response = await request.delete(
        "/api/email-accounts/507f1f77bcf86cd799439011"
      );

      expect(response.status()).toBe(401);
    });

    test("rejects testing an email account without authentication", async ({
      request,
    }) => {
      const response = await request.post(
        "/api/email-accounts/507f1f77bcf86cd799439011/test"
      );

      expect(response.status()).toBe(401);
    });
  });

  test.describe("create", () => {
    test("creates an email account", async ({ request }) => {
      const user = await createTestUser(request);

      const response = await request.post(
        "/api/email-accounts",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          data: {
            name: "My SMTP Account",
            host: "127.0.0.1",
            port: 1025,
            secure: false,
            username: "sender@example.com",
            password: "secret-password",
            from: "sender@example.com",
          },
        }
      );

      expect(response.status()).toBe(201);

      const body = await response.json();

      expect(body.data).toMatchObject({
        name: "My SMTP Account",
        host: "127.0.0.1",
        port: 1025,
        secure: false,
        username: "sender@example.com",
        from: "sender@example.com",
      });

      expect(body.data._id).toBeTruthy();
      expect(body.data.userId).toBe(user.id);
    });

    test("does not return the SMTP password", async ({
      request,
    }) => {
      const user = await createTestUser(request);

      const account = await createEmailAccount(
        request,
        user.token
      );

      expect(account).not.toHaveProperty("password");
      expect(account).not.toHaveProperty(
        "encryptedPassword"
      );
    });

    test("rejects missing name", async ({ request }) => {
      const user = await createTestUser(request);

      const response = await request.post(
        "/api/email-accounts",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          data: {
            host: "127.0.0.1",
            port: 1025,
            secure: false,
            username: "sender@example.com",
            password: "password",
          },
        }
      );

      expect(response.status()).toBe(400);
    });

    test("rejects empty name", async ({ request }) => {
      const user = await createTestUser(request);

      const response = await request.post(
        "/api/email-accounts",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          data: {
            name: "",
            host: "127.0.0.1",
            port: 1025,
            secure: false,
            username: "sender@example.com",
            password: "password",
          },
        }
      );

      expect(response.status()).toBe(400);
    });

    test("rejects missing host", async ({ request }) => {
      const user = await createTestUser(request);

      const response = await request.post(
        "/api/email-accounts",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          data: {
            name: "Test",
            port: 1025,
            secure: false,
            username: "sender@example.com",
            password: "password",
          },
        }
      );

      expect(response.status()).toBe(400);
    });

    test("rejects invalid port", async ({ request }) => {
      const user = await createTestUser(request);

      const response = await request.post(
        "/api/email-accounts",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          data: {
            name: "Test",
            host: "127.0.0.1",
            port: "invalid",
            secure: false,
            username: "sender@example.com",
            password: "password",
          },
        }
      );

      expect(response.status()).toBe(400);
    });

    test("rejects invalid username email", async ({
      request,
    }) => {
      const user = await createTestUser(request);

      const response = await request.post(
        "/api/email-accounts",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          data: {
            name: "Test",
            host: "127.0.0.1",
            port: 1025,
            secure: false,
            username: "not-an-email",
            password: "password",
          },
        }
      );

      expect(response.status()).toBe(400);
    });

    test("rejects missing password", async ({ request }) => {
      const user = await createTestUser(request);

      const response = await request.post(
        "/api/email-accounts",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          data: {
            name: "Test",
            host: "127.0.0.1",
            port: 1025,
            secure: false,
            username: "sender@example.com",
          },
        }
      );

      expect(response.status()).toBe(400);
    });

    test("rejects invalid from address", async ({
      request,
    }) => {
      const user = await createTestUser(request);

      const response = await request.post(
        "/api/email-accounts",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          data: {
            name: "Test",
            host: "127.0.0.1",
            port: 1025,
            secure: false,
            username: "sender@example.com",
            password: "password",
            from: "not-an-email",
          },
        }
      );

      expect(response.status()).toBe(400);
    });

    test("stores SMTP password encrypted rather than plaintext", async ({
      request,
    }) => {
      const user = await createTestUser(request);

      await createEmailAccount(
        request,
        user.token,
        {
          password: "super-secret-password",
        }
      );

      const account = await EmailAccount.findOne({
        userId: user.id,
      }).lean();

      expect(account).toBeTruthy();

      expect(account.password).not.toBe(
        "super-secret-password"
      );

      expect(account.encryptedPassword).toBeTruthy();

      expect(account.encryptedPassword).not.toBe(
        "super-secret-password"
      );
    });

    test("generates a public ID", async ({ request }) => {
      const user = await createTestUser(request);

      const account = await createEmailAccount(
        request,
        user.token
      );

      expect(account.data.publicId).toBeTruthy();
      expect(typeof account.data.publicId).toBe(
        "string"
      );
    });

    test("public ID is different from Mongo ID", async ({
      request,
    }) => {
      const user = await createTestUser(request);

      const account = await createEmailAccount(
        request,
        user.token
      );

      expect(account.data.publicId).not.toBe(
        account.data._id
      );
    });

  });

  test.describe("list", () => {
    test("returns only the authenticated user's accounts", async ({
      request,
    }) => {
      const userA = await createTestUser(request);
      const userB = await createTestUser(request);

      await createEmailAccount(
        request,
        userA.token,
        {
          name: "User A Account",
        }
      );

      await createEmailAccount(
        request,
        userB.token,
        {
          name: "User B Account",
        }
      );

      const response = await request.get(
        "/api/email-accounts",
        {
          headers: {
            Authorization: `Bearer ${userA.token}`,
          },
        }
      );

      expect(response.status()).toBe(200);

      const { data: accounts } = await response.json();

      expect(accounts).toHaveLength(1);
      expect(accounts[0].name).toBe("User A Account");
    });

    test("does not expose passwords when listing accounts", async ({
      request,
    }) => {
      const user = await createTestUser(request);

      await createEmailAccount(
        request,
        user.token
      );

      const response = await request.get(
        "/api/email-accounts",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const { data: accounts } = await response.json();

      expect(accounts[0]).not.toHaveProperty("password");
      expect(accounts[0]).not.toHaveProperty(
        "encryptedPassword"
      );
    });

    test("returns the public ID when listing accounts", async ({
      request,
    }) => {
      const user = await createTestUser(request);

      const account = await createEmailAccount(
        request,
        user.token
      );

      const response = await request.get(
        "/api/email-accounts",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      expect(response.status()).toBe(200);

      const { data: accounts } =
        await response.json();

      expect(accounts[0].publicId).toBe(
        account.data.publicId
      );
    });
  });

  test.describe("retrieve", () => {
    test("retrieves an owned email account", async ({
      request,
    }) => {
      const user = await createTestUser(request);

      const account = await createEmailAccount(
        request,
        user.token
      );

      const response = await request.get(
        `/api/email-accounts/${account.data._id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      expect(response.status()).toBe(200);

      const body = await response.json();

      expect(body).toMatchObject({
        data: {
          _id: account.data._id,
          userId: user.id,
          name: "Test Mail Account",
          host: "127.0.0.1",
          port: 1025,
          secure: false,
          username: "sender@example.com",
          from: "sender@example.com",
        },
      });
    });



    test("returns 404 for a nonexistent account", async ({
      request,
    }) => {
      const user = await createTestUser(request);

      const response = await request.get(
        "/api/email-accounts/507f1f77bcf86cd799439011",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      expect(response.status()).toBe(404);
    });

    test("returns 400 for an invalid account id", async ({
      request,
    }) => {
      const user = await createTestUser(request);

      const response = await request.get(
        "/api/email-accounts/not-an-id",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      expect(response.status()).toBe(400);
    });

    test("cannot retrieve another user's account", async ({
      request,
    }) => {
      const userA = await createTestUser(request);
      const userB = await createTestUser(request);

      const account = await createEmailAccount(
        request,
        userA.token
      );

      const response = await request.get(
        `/api/email-accounts/${account.data._id}`,
        {
          headers: {
            Authorization: `Bearer ${userB.token}`,
          },
        }
      );

      expect(response.status()).toBe(404);
    });

    test("returns the public ID when retrieving an account", async ({
      request,
    }) => {
      const user = await createTestUser(request);

      const account = await createEmailAccount(
        request,
        user.token
      );

      const response = await request.get(
        `/api/email-accounts/${account.data._id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      expect(response.status()).toBe(200);

      const body = await response.json();

      expect(body.data.publicId).toBe(
        account.data.publicId
      );
    });
  });

  test.describe("update", () => {
    test("updates an owned account", async ({ request }) => {
      const user = await createTestUser(request);

      const account = await createEmailAccount(
        request,
        user.token
      );

      const response = await request.put(
        `/api/email-accounts/${account.data._id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          data: {
            name: "Updated Account",
            host: "127.0.0.1",
            port: 1025,
            secure: false,
            username: "updated@example.com",
            password: "updated-password",
            from: "updated@example.com",
          },
        }
      );

      expect(response.status()).toBe(200);

      const body = await response.json();

      expect(body.data).toMatchObject({
        name: "Updated Account",
        username: "updated@example.com",
        from: "updated@example.com",
      });

      expect(body).not.toHaveProperty("password");
      expect(body).not.toHaveProperty(
        "encryptedPassword"
      );
    });

    test("cannot update another user's account", async ({
      request,
    }) => {
      const userA = await createTestUser(request);
      const userB = await createTestUser(request);

      const account = await createEmailAccount(
        request,
        userA.token
      );

      const response = await request.put(
        `/api/email-accounts/${account.data._id}`,
        {
          headers: {
            Authorization: `Bearer ${userB.token}`,
          },
          data: {
            name: "Hijacked Account",
          },
        }
      );

      expect(response.status()).toBe(404);
    });

    test("rejects invalid update data", async ({
      request,
    }) => {
      const user = await createTestUser(request);

      const account = await createEmailAccount(
        request,
        user.token
      );

      const response = await request.put(
        `/api/email-accounts/${account.data._id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          data: {
            port: "invalid",
          },
        }
      );

      expect(response.status()).toBe(400);
    });

    test("returns 404 when updating nonexistent account", async ({
      request,
    }) => {
      const user = await createTestUser(request);

      const response = await request.put(
        "/api/email-accounts/507f1f77bcf86cd799439011",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          data: {
            name: "Updated",
          },
        }
      );

      expect(response.status()).toBe(404);
    });
  });

  test.describe("delete", () => {
    test("deletes an owned account", async ({ request }) => {
      const user = await createTestUser(request);

      const account = await createEmailAccount(
        request,
        user.token
      );

      const response = await request.delete(
        `/api/email-accounts/${account.data._id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      expect(response.status()).toBe(204);

      const getResponse = await request.get(
        `/api/email-accounts/${account.data._id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      expect(getResponse.status()).toBe(404);
    });

    test("cannot delete another user's account", async ({
      request,
    }) => {
      const userA = await createTestUser(request);
      const userB = await createTestUser(request);

      const account = await createEmailAccount(
        request,
        userA.token
      );

      const response = await request.delete(
        `/api/email-accounts/${account.data._id}`,
        {
          headers: {
            Authorization: `Bearer ${userB.token}`,
          },
        }
      );

      expect(response.status()).toBe(404);
    });

    test("returns 404 when deleting nonexistent account", async ({
      request,
    }) => {
      const user = await createTestUser(request);

      const response = await request.delete(
        "/api/email-accounts/507f1f77bcf86cd799439011",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      expect(response.status()).toBe(404);
    });
  });

  test.describe("SMTP verification", () => {
    test("successfully verifies a valid MailDev account", async ({
      request,
    }) => {
      const user = await createTestUser(request);

      const account = await createEmailAccount(
        request,
        user.token
      );

      const response = await request.post(
        `/api/email-accounts/${account.data._id}/test`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      expect(response.status()).toBe(200);

      const body = await response.json();

      expect(body.data).toMatchObject({
        success: true,
      });
    });

    test("returns an error for invalid SMTP configuration", async ({
      request,
    }) => {
      const user = await createTestUser(request);

      const account = await createEmailAccount(
        request,
        user.token,
        {
          host: "127.0.0.1",
          port: 19999,
        }
      );

      const response = await request.post(
        `/api/email-accounts/${account.data._id}/test`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      expect([400, 502, 503]).toContain(
        response.status()
      );
    });

    test("cannot test another user's account", async ({
      request,
    }) => {
      const userA = await createTestUser(request);
      const userB = await createTestUser(request);

      const account = await createEmailAccount(
        request,
        userA.token
      );

      const response = await request.post(
        `/api/email-accounts/${account.data._id}/test`,
        {
          headers: {
            Authorization: `Bearer ${userB.token}`,
          },
        }
      );

      expect(response.status()).toBe(404);
    });
  });

  test("decrypts the SMTP password when retrieving an account for sending", async ({
    request,
  }) => {
    const user = await createTestUser(request);

    const password = "test-password-123";

    const account = await createEmailAccount(
      request,
      user.token,
      {
        password,
      }
    );

    const storedAccount = await EmailAccount.findById(
      account.data._id
    ).lean();

    expect(storedAccount.encryptedPassword).toBeDefined();
    expect(storedAccount.encryptedPassword).not.toBe(password);

    const emailAccount =
      await getEmailAccountForSending(
        user.id,
        account.data._id
      );

    expect(emailAccount.password).toBe(password);
  });
});


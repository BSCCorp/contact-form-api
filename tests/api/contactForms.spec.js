// tests/api/contactForms.spec.js

const {
  test,
  expect,
} = require("../fixtures/database");

const { createTestUser, } = require("../helpers/users");
const { createEmailAccount } = require("../helpers/emailAccounts.js");
const { createContactForm, contactFormPayload, } = require("../helpers/contactForms.js");
const { clearMaildev, getMaildevEmails, getMaildevRawEmail, waitForMail, getEmails, getEmail } = require("../fixtures/maildev.js");

test.describe("Contact Forms API", () => {
  test.beforeEach(async ({ request }) => {
    await clearMaildev(request);
  });

  test("creates a contact form", async ({
    request,
  }) => {
    const user = await createTestUser(request);

    const account = await createEmailAccount(
      request,
      user.token
    );

    const payload = contactFormPayload(
      account.data._id
    );

    const response = await request.post(
      "/api/contact-forms",
      {
        headers: {
          Authorization:
            `Bearer ${user.token}`,
        },
        data: payload,
      }
    );

    expect(response.status()).toBe(201);

    const body = await response.json();

    expect(body).toMatchObject({
      userId: user.id,
      emailAccountId: account.data._id,
      name: "Jane Doe",
      email: "jane@example.com",
      subject: "Test contact form",
      message:
        "This is a test contact form message.",
    });
  });

  test.describe("email delivery", () => {

    test("sends a contact-form email through the configured SMTP account", async ({
      request,
    }) => {
      const user = await createTestUser(request);

      const account = await createEmailAccount(
        request,
        user.token,
        {
          username: "owner@example.com",
          from: "owner@example.com",
        }
      );

      const response = await request.post(
        "/api/contact-forms",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          data: contactFormPayload(
            account.data._id,
            {
              name: "John Smith",
              email: "john@example.com",
              subject: "I need help",
              message:
                "Please help me with my account.",
            }
          ),
        }
      );

      expect(response.status()).toBe(201);

      const email = await waitForMail(
        request
      );

      expect(email[0].from[0].address).toBe(
        "owner@example.com"
      );

      expect(email[0].to[0].address).toBe(
        "owner@example.com"
      );

      expect(email[0].subject).toBe(
        "I need help"
      );
      expect(email[0].text).toContain(
        "Please help me with my account."
      );

      expect(email[0].text).toContain(
        "John Smith"
      );

      expect(email[0].text).toContain(
        "john@example.com"
      );
    });

    test("uses username as from when from is omitted", async ({
      request,
    }) => {
      const user = await createTestUser(request);

      const account = await createEmailAccount(
        request,
        user.token
      );

      await createContactForm(
        request,
        user.token,
        account.data._id
      );

      const email = await waitForMail(request);

      expect(email[0].from[0].address).toBe(
        "sender@example.com"
      );
    });

   test("uses the contact email as Reply-To", async ({
     request,
   }) => {
     const user = await createTestUser(request);

     const account = await createEmailAccount(
       request,
       user.token
     );

     await createContactForm(
       request,
       user.token,
       account.data._id,
       {
         name: "Customer",
         email: "customer@example.com",
         subject: "I need help",
         message: "Please help me with my account.",
       }
     );

     const emails = await waitForMail(request);

     expect(emails).toHaveLength(1);

     const rawEmail = await getMaildevRawEmail(
       request,
       emails[0].id
     );

     expect(rawEmail).toContain(
       "Reply-To: customer@example.com"
     );
   });

    test("does not send an email when authorization fails", async ({
      request,
    }) => {
      const userA = await createTestUser(request);
      const userB = await createTestUser(request);

      const account = await createEmailAccount(
        request,
        userA.token
      );

      const response = await request.post(
        "/api/contact-forms",
        {
          headers: {
            Authorization: `Bearer ${userB.token}`,
          },
          data: contactFormPayload(
            account.data._id
          ),
        }
      );

      expect(response.status()).toBe(404);

      const emails = await getMaildevEmails(
        request
      );

      expect(emails).toHaveLength(0);
    });

    test("sends only one email for one contact form", async ({
      request,
    }) => {
      const user = await createTestUser(request);

      const account = await createEmailAccount(
        request,
        user.token
      );

      await createContactForm(
        request,
        user.token,
        account.data._id
      );

      await waitForMail(request);

      const emails = await getMaildevEmails(
        request
      );

      expect(emails).toHaveLength(1);
    });

    test("sends separate emails for multiple contact forms", async ({
      request,
    }) => {
      const user = await createTestUser(request);

      const account = await createEmailAccount(
        request,
        user.token
      );

      await createContactForm(
        request,
        user.token,
        account.data._id,
        {
          subject: "First",
        }
      );

      await createContactForm(
        request,
        user.token,
        account.data._id,
        {
          subject: "Second",
        }
      );

      const start = Date.now();

      while (Date.now() - start < 5000) {
        const emails =
          await getMaildevEmails(request);

        if (emails.length === 2) {
          break;
        }

        await new Promise((resolve) =>
          setTimeout(resolve, 100)
        );
      }

      const emails = await getMaildevEmails(
        request
      );

      expect(emails).toHaveLength(2);

      expect(
        emails.map((email) => email.subject)
      ).toEqual(
        expect.arrayContaining([
          "First",
          "Second",
        ])
      );
    });
  });

  test.describe("GET /api/contact-forms", () => {
    test("returns the user's contact forms", async ({
      request,
    }) => {
      const user = await createTestUser(request);

      const account = await createEmailAccount(
        request,
        user.token
      );

      await createContactForm(
        request,
        user.token,
        account.data._id,
        {
          subject: "First",
        }
      );

      await createContactForm(
        request,
        user.token,
        account.data._id,
        {
          subject: "Second",
        }
      );

      const response = await request.get(
        "/api/contact-forms",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      expect(response.status()).toBe(200);

      const body = await response.json();

      expect(body).toHaveLength(2);

      expect(
        body.map((form) => form.subject)
      ).toEqual(
        expect.arrayContaining([
          "First",
          "Second",
        ])
      );
    });

    test("does not return another user's forms", async ({
      request,
    }) => {
      const userA = await createTestUser(request);
      const userB = await createTestUser(request);

      const accountA = await createEmailAccount(
        request,
        userA.token
      );

      await createContactForm(
        request,
        userA.token,
        accountA.data._id
      );

      const response = await request.get(
        "/api/contact-forms",
        {
          headers: {
            Authorization: `Bearer ${userB.token}`,
          },
        }
      );

      expect(response.status()).toBe(200);

      const body = await response.json();

      expect(body).toHaveLength(0);
    });

    test("requires authentication", async ({
      request,
    }) => {
      const response = await request.get(
        "/api/contact-forms"
      );

      expect(response.status()).toBe(401);
    });
  });

  test.describe("GET /api/contact-forms/:id", () => {
    test("returns the user's contact form", async ({
      request,
    }) => {
      const user = await createTestUser(request);

      const account = await createEmailAccount(
        request,
        user.token
      );

      const form = await createContactForm(
        request,
        user.token,
        account.data._id
      );

      const response = await request.get(
        `/api/contact-forms/${form._id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      expect(response.status()).toBe(200);

      const body = await response.json();

      expect(body._id).toBe(form._id);
    });

    test("cannot access another user's form", async ({
      request,
    }) => {
      const userA = await createTestUser(request);
      const userB = await createTestUser(request);

      const account = await createEmailAccount(
        request,
        userA.token
      );

      const form = await createContactForm(
        request,
        userA.token,
        account.data._id
      );

      const response = await request.get(
        `/api/contact-forms/${form._id}`,
        {
          headers: {
            Authorization: `Bearer ${userB.token}`,
          },
        }
      );

      expect(response.status()).toBe(404);
    });

    test("cannot submit a contact form using another user's email account", async ({
      request,
    }) => {
      const userA = await createTestUser(request);
      const userB = await createTestUser(request);

      const accountA = await createEmailAccount(
        request,
        userA.token
      );

      const response = await request.post(
        "/api/contact-forms",
        {
          headers: {
            Authorization: `Bearer ${userB.token}`,
          },

          data: {
            emailAccountId: accountA.data._id,
            name: "Customer",
            email: "customer@example.com",
            subject: "Hello",
            message: "Test",
          },
        }
      );

      expect(response.status()).toBe(404);
    });

    test("cannot send through another user's email account", async ({
      request,
    }) => {
      const userA = await createTestUser(request);
      const userB = await createTestUser(request);

      const accountA = await createEmailAccount(
        request,
        userA.token
      );

      const response = await request.post(
        "/api/contact-forms",
        {
          headers: {
            Authorization: `Bearer ${userB.token}`,
          },
          data: {
            emailAccountId: accountA.data._id,
            name: "Attacker",
            email: "attacker@example.com",
            subject: "Test",
            message: "This should fail",
          },
        }
      );

      expect(response.status()).toBe(404);

      const emails =
        await getMaildevEmails(request);

      expect(emails).toHaveLength(0);
    });



    test("returns 404 for a nonexistent form", async ({
      request,
    }) => {
      const user = await createTestUser(request);

      const response = await request.get(
        "/api/contact-forms/507f1f77bcf86cd799439011",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      expect(response.status()).toBe(404);
    });

    test("requires authentication", async ({
      request,
    }) => {
      const response = await request.get(
        "/api/contact-forms/507f1f77bcf86cd799439011"
      );

      expect(response.status()).toBe(401);
    });
  });

  test.describe("DELETE /api/contact-forms/:id", () => {
    test("deletes the user's contact form", async ({
      request,
    }) => {
      const user = await createTestUser(request);

      const account = await createEmailAccount(
        request,
        user.token
      );

      const form = await createContactForm(
        request,
        user.token,
        account.data._id
      );

      const response = await request.delete(
        `/api/contact-forms/${form._id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      expect(response.status()).toBe(204);

      const getResponse = await request.get(
        `/api/contact-forms/${form._id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      expect(getResponse.status()).toBe(404);
    });

    test("cannot delete another user's form", async ({
      request,
    }) => {
      const userA = await createTestUser(request);
      const userB = await createTestUser(request);

      const account = await createEmailAccount(
        request,
        userA.token
      );

      const form = await createContactForm(
        request,
        userA.token,
        account.data._id
      );

      const response = await request.delete(
        `/api/contact-forms/${form._id}`,
        {
          headers: {
            Authorization: `Bearer ${userB.token}`,
          },
        }
      );

      expect(response.status()).toBe(404);
    });

    test("requires authentication", async ({
      request,
    }) => {
      const response = await request.delete(
        "/api/contact-forms/507f1f77bcf86cd799439011"
      );

      expect(response.status()).toBe(401);
    });
  });
});



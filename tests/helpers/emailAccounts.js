const { expect, } = require("@playwright/test");

async function createEmailAccount(
  request,
  token,
  overrides = {}
) {
  const payload = {
    name: "Test Mail Account",
    host: "127.0.0.1",
    port: 1025,
    secure: false,
    username: "sender@example.com",
    password: "test-password",
    from: "sender@example.com",
    ...overrides,
  };

  const response = await request.post(
    "/api/email-accounts",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: payload,
    }
  );

  if (!response.ok()) {
    console.log(
      "Email account request:",
      response.status()
    );

    console.log(
      "Email account payload:",
      payload
    );

    console.log(
      "Email account response:",
      await response.text()
    );
  }

  expect(response.ok()).toBeTruthy();

  return response.json();
}

module.exports = {
  createEmailAccount,
};


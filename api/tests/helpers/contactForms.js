const { expect } = require("../fixtures/database");

function contactFormPayload(
  emailAccountId,
  overrides = {}
) {
  return {
    emailAccountId,
    name: "Jane Doe",
    email: "jane@example.com",
    subject: "Test contact form",
    message: "This is a test contact form message.",
    ...overrides,
  };
}

async function createContactForm(
  request,
  token,
  emailAccountId,
  overrides = {}
) {
  const payload = contactFormPayload(
    emailAccountId,
    overrides
  );

  const response = await request.post(
    "/api/contact-forms",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: payload,
    }
  );

  expect(response.ok()).toBeTruthy();

  return response.json();
}

module.exports = {
  contactFormPayload,
  createContactForm,
};


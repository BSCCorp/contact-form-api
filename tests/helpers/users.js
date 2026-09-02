// tests/helpers/users.js

const { expect } = require("@playwright/test");

async function createTestUser(request) {
  const password = "password123";

  const email =
    `jane-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}@example.com`;

  const registerResponse =
    await request.post(
      "/api/auth/register",
      {
        data: {
          name: "Jane Doe",
          email,
          password,
        },
      }
    );

  expect(
    registerResponse.ok()
  ).toBeTruthy();

  const loginResponse =
    await request.post(
      "/api/auth/login",
      {
        data: {
          email,
          password,
        },
      }
    );

  expect(
    loginResponse.ok()
  ).toBeTruthy();

  const body =
    await loginResponse.json();

  return {
    id: body.user.id,
    token: body.token,
    email,
    password,
    name: "Jane Doe",
  };
}

module.exports = {
  createTestUser,
};


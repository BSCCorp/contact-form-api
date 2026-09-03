const { test, expect } = require("../fixtures/database");
const User = require("../../src/modules/users/user.model");
const { createTestUser } = require("../helpers/users");

async function login(request, user) {
  const response = await request.post(
    "/api/auth/login",
    {
      data: {
        email: user.email,
        password: "password123",
      },
    }
  );

  expect(response.status()).toBe(200);

  const body = await response.json();

  return body.token;
}

test.describe("Users API", () => {

  test("health endpoint works", async ({ request }) => {
    const response = await request.get("/health");

    expect(response.ok()).toBeTruthy();

    const body = await response.json();

    expect(body.status).toBe("ok");
  });

  test("authenticated user can get a user by ID", async ({
    request,
  }) => {
    const user = await createTestUser(request);
    const token = await login(request, user);

    const response = await request.get(
      `/api/users/${user.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.id).toBe(user.id.toString());
    expect(body.name).toBe(user.name);
    expect(body.email).toBe(user.email);
  });

  test("does not return password hash", async ({
    request,
  }) => {
    const user = await createTestUser(request);
    const token = await login(request, user);

    const response = await request.get(
      `/api/users/${user.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body).not.toHaveProperty("password");
    expect(body).not.toHaveProperty("passwordHash");
  });

  test("rejects unauthenticated request", async ({
    request,
  }) => {
    const user = await createTestUser(request);

    const response = await request.get(
      `/api/users/${user.id}`
    );

    expect(response.status()).toBe(401);

    const body = await response.json();

    expect(body.error).toBe(
      "Authentication required"
    );
  });

  test("rejects invalid token", async ({
    request,
  }) => {
    const user = await createTestUser(request);

    const response = await request.get(
      `/api/users/${user.id}`,
      {
        headers: {
          Authorization: "Bearer invalid-token",
        },
      }
    );

    expect(response.status()).toBe(401);

    const body = await response.json();

    expect(body.error).toBe(
      "Invalid or expired token"
    );
  });

  test("returns 404 for nonexistent user", async ({
    request,
  }) => {
    const user = await createTestUser(request);
    const token = await login(request, user);

    const fakeId = "507f1f77bcf86cd799439011";

    const response = await request.get(
      `/api/users/${fakeId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    expect(response.status()).toBe(404);

    const body = await response.json();

    expect(body.error).toBe("User not found");
  });

  test("rejects malformed user ID", async ({
    request,
  }) => {
    const user = await createTestUser(request);
    const token = await login(request, user);

    const response = await request.get(
      "/api/users/not-a-valid-id",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    expect(response.status()).toBe(400);
  });

  test("login works with uppercase email", async ({
    request,
  }) => {
    const email = `user-${Date.now()}@example.com`;

    await request.post("/api/auth/register", {
      data: {
        name: "Email Test",
        email,
        password: "password123",
      },
    });

    const response = await request.post(
      "/api/auth/login",
      {
        data: {
          email: email.toUpperCase(),
          password: "password123",
        },
      }
    );

    expect(response.status()).toBe(200);
  });


});


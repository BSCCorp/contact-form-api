const { test, expect } = require("../fixtures/database");

test.describe("Authentication", () => {
  test("can register a user", async ({ request }) => {
    const response = await request.post("/api/auth/register", {
      data: {
        name: "Jane Doe",
        email: `jane-${Date.now()}@example.com`,
        password: "password123",
      },
    });

    expect(response.status()).toBe(201);

    const body = await response.json();

    expect(body).toHaveProperty("token");
    expect(body).toHaveProperty("user");

    expect(body.user.name).toBe("Jane Doe");
    expect(body.user.email).toContain("@example.com");

    // Sensitive information should never leave the API.
    expect(body.user).not.toHaveProperty("password");
    expect(body.user).not.toHaveProperty("passwordHash");
  });

  test("rejects duplicate email", async ({ request }) => {
    const email = `duplicate-${Date.now()}@example.com`;

    const user = {
      name: "Jane Doe",
      email,
      password: "password123",
    };

    const firstResponse = await request.post(
      "/api/auth/register",
      { data: user }
    );

    expect(firstResponse.status()).toBe(201);

    const secondResponse = await request.post(
      "/api/auth/register",
      { data: user }
    );

    expect(secondResponse.status()).toBe(409);

    const body = await secondResponse.json();

    expect(body.error).toBe("Email already registered");
  });

  test("rejects invalid registration data", async ({ request }) => {
    const response = await request.post(
      "/api/auth/register",
      {
        data: {
          name: "",
          email: "not-an-email",
          password: "123",
        },
      }
    );

    expect(response.status()).toBe(400);

    const body = await response.json();

    expect(body.error).toBe("Invalid request");
    expect(body.details).toBeDefined();
  });

  test("can log in", async ({ request }) => {
    const email = `login-${Date.now()}@example.com`;
    const password = "password123";

    await request.post("/api/auth/register", {
      data: {
        name: "Login User",
        email,
        password,
      },
    });

    const response = await request.post(
      "/api/auth/login",
      {
        data: {
          email,
          password,
        },
      }
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.token).toBeTruthy();
    expect(body.user.email).toBe(email);

    expect(body.user).not.toHaveProperty("password");
    expect(body.user).not.toHaveProperty("passwordHash");
  });

  test("rejects incorrect password", async ({ request }) => {
    const email = `wrong-password-${Date.now()}@example.com`;

    await request.post("/api/auth/register", {
      data: {
        name: "Test User",
        email,
        password: "correct-password",
      },
    });

    const response = await request.post(
      "/api/auth/login",
      {
        data: {
          email,
          password: "wrong-password",
        },
      }
    );

    expect(response.status()).toBe(401);

    const body = await response.json();

    expect(body.error).toBe("Invalid email or password");
  });

  test("rejects nonexistent email", async ({ request }) => {
    const response = await request.post(
      "/api/auth/login",
      {
        data: {
          email: "does-not-exist@example.com",
          password: "password123",
        },
      }
    );

    expect(response.status()).toBe(401);

    const body = await response.json();

    expect(body.error).toBe("Invalid email or password");
  });

  test("authenticated user can access /me", async ({ request }) => {
    const email = `me-${Date.now()}@example.com`;
    const password = "password123";

    const registerResponse = await request.post(
      "/api/auth/register",
      {
        data: {
          name: "Me User",
          email,
          password,
        },
      }
    );

    expect(registerResponse.status()).toBe(201);

    const registerBody = await registerResponse.json();

    const token = registerBody.token;

    const response = await request.get("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.user.name).toBe("Me User");
    expect(body.user.email).toBe(email);

    expect(body.user).not.toHaveProperty("password");
    expect(body.user).not.toHaveProperty("passwordHash");
  });

  test("rejects unauthenticated /me request", async ({ request }) => {
    const response = await request.get("/api/auth/me");
  
    expect(response.status()).toBe(401);
  
    const body = await response.json();
  
    expect(body.error).toBe("Authentication required");
  });

  test("rejects invalid JWT", async ({ request }) => {
    const response = await request.get("/api/auth/me", {
      headers: {
        Authorization: "Bearer definitely-not-a-real-token",
      },
    });
  
    expect(response.status()).toBe(401);
  
    const body = await response.json();
  
    expect(body.error).toBe("Invalid or expired token");
  });

  test("rejects malformed authorization header", async ({ request }) => {
    const response = await request.get("/api/auth/me", {
      headers: {
        Authorization: "NotBearer something",
      },
    });
  
    expect(response.status()).toBe(401);
  });

});


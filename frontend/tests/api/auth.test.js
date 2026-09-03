import { describe, expect, it } from "vitest";

import {
  register,
  login,
  getMe,
} from "../../src/api/auth";

describe("auth API", () => {
  it("registers a user", async () => {
    const result = await register({
      name: "Jane Doe",
      email: "jane@example.com",
      password: "password123",
    });

    expect(result.user.name).toBe("Jane Doe");
    expect(result.user.email).toBe("jane@example.com");
    expect(result.token).toBe("test-token");
  });

  it("logs in a user", async () => {
    const result = await login({
      email: "jane@example.com",
      password: "password123",
    });

    expect(result.user.email).toBe("jane@example.com");
    expect(result.token).toBe("test-token");
  });

  it("returns an error for invalid credentials", async () => {
    await expect(
      login({
        email: "wrong@example.com",
        password: "wrong",
      })
    ).rejects.toThrow("Invalid email or password");
  });

  it("gets the current user", async () => {
    const result = await getMe();

    expect(result.user.id).toBe("user-1");
    expect(result.user.email).toBe("jane@example.com");
  });
});


import { beforeEach, describe, expect, it, vi } from "vitest";

import { apiFetch } from "../../src/api/client";

describe("apiFetch", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("makes a GET request when no options are supplied", async () => {
    const response = {
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({
        data: "success",
      }),
    };

    vi.spyOn(globalThis, "fetch").mockResolvedValue(response);

    const result = await apiFetch("/users");

    expect(result).toEqual({
      data: "success",
    });

    expect(fetch).toHaveBeenCalledTimes(1);

    const [url, options] = fetch.mock.calls[0];

    expect(url).toMatch(/\/users$/);
    expect(options.headers).toBeInstanceOf(Headers);
  });

  it("sets Content-Type to application/json when a body is supplied", async () => {
    const response = {
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({
        success: true,
      }),
    };

    vi.spyOn(globalThis, "fetch").mockResolvedValue(response);

    await apiFetch("/users", {
      method: "POST",
      body: JSON.stringify({
        name: "Jane Doe",
      }),
    });

    const [, options] = fetch.mock.calls[0];

    expect(options.method).toBe("POST");
    expect(options.headers.get("Content-Type")).toBe(
      "application/json"
    );
  });

  it("does not overwrite an existing Content-Type header", async () => {
    const response = {
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({
        success: true,
      }),
    };

    vi.spyOn(globalThis, "fetch").mockResolvedValue(response);

    await apiFetch("/upload", {
      method: "POST",
      body: "some-body",
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const [, options] = fetch.mock.calls[0];

    expect(options.headers.get("Content-Type")).toBe(
      "multipart/form-data"
    );
  });

  it("preserves custom headers", async () => {
    const response = {
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({
        success: true,
      }),
    };

    vi.spyOn(globalThis, "fetch").mockResolvedValue(response);

    await apiFetch("/test", {
      headers: {
        "X-Custom-Header": "custom-value",
      },
    });

    const [, options] = fetch.mock.calls[0];

    expect(options.headers.get("X-Custom-Header")).toBe(
      "custom-value"
    );
  });

  it("adds the Authorization header when a token exists", async () => {
    localStorage.setItem("token", "test-token");

    const response = {
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({
        success: true,
      }),
    };

    vi.spyOn(globalThis, "fetch").mockResolvedValue(response);

    await apiFetch("/protected");

    const [, options] = fetch.mock.calls[0];

    expect(options.headers.get("Authorization")).toBe(
      "Bearer test-token"
    );
  });

  it("does not add an Authorization header when there is no token", async () => {
    const response = {
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({
        success: true,
      }),
    };

    vi.spyOn(globalThis, "fetch").mockResolvedValue(response);

    await apiFetch("/public");

    const [, options] = fetch.mock.calls[0];

    expect(options.headers.has("Authorization")).toBe(false);
  });

  it("returns parsed JSON for a successful response", async () => {
    const body = {
      data: {
        id: "user-1",
        name: "Jane Doe",
      },
    };

    const response = {
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue(body),
    };

    vi.spyOn(globalThis, "fetch").mockResolvedValue(response);

    const result = await apiFetch("/users/user-1");

    expect(result).toEqual(body);
    expect(response.json).toHaveBeenCalledTimes(1);
  });

  it("returns parsed JSON for a 201 response", async () => {
    const body = {
      data: {
        id: "account-new",
      },
    };

    const response = {
      ok: true,
      status: 201,
      json: vi.fn().mockResolvedValue(body),
    };

    vi.spyOn(globalThis, "fetch").mockResolvedValue(response);

    const result = await apiFetch("/email-accounts", {
      method: "POST",
      body: JSON.stringify({
        name: "SMTP Account",
      }),
    });

    expect(result).toEqual(body);
    expect(response.json).toHaveBeenCalledTimes(1);
  });

  it("returns null for a 204 response", async () => {
    const response = {
      ok: true,
      status: 204,
      json: vi.fn(),
    };

    vi.spyOn(globalThis, "fetch").mockResolvedValue(response);

    const result = await apiFetch("/email-accounts/account-1", {
      method: "DELETE",
    });

    expect(result).toBeNull();
    expect(response.json).not.toHaveBeenCalled();
  });

  it("throws the API error message when the response contains an error", async () => {
    const response = {
      ok: false,
      status: 401,
      json: vi.fn().mockResolvedValue({
        error: "Invalid email or password",
      }),
    };

    vi.spyOn(globalThis, "fetch").mockResolvedValue(response);

    await expect(
      apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: "wrong@example.com",
          password: "wrong",
        }),
      })
    ).rejects.toThrow("Invalid email or password");
  });

  it("sets the error status from the HTTP response", async () => {
    const response = {
      ok: false,
      status: 401,
      json: vi.fn().mockResolvedValue({
        error: "Invalid email or password",
      }),
    };

    vi.spyOn(globalThis, "fetch").mockResolvedValue(response);

    try {
      await apiFetch("/auth/login");
      throw new Error("Expected apiFetch to throw");
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(
        "Invalid email or password"
      );
      expect(error.status).toBe(401);
    }
  });

  it("uses Request failed when the error response is not JSON", async () => {
    const response = {
      ok: false,
      status: 500,
      json: vi.fn().mockRejectedValue(
        new Error("Invalid JSON")
      ),
    };

    vi.spyOn(globalThis, "fetch").mockResolvedValue(response);

    await expect(
      apiFetch("/server-error")
    ).rejects.toThrow("Request failed");
  });

  it("uses Request failed when the JSON response has no error property", async () => {
    const response = {
      ok: false,
      status: 400,
      json: vi.fn().mockResolvedValue({
        message: "Bad request",
      }),
    };

    vi.spyOn(globalThis, "fetch").mockResolvedValue(response);

    try {
      await apiFetch("/bad-request");
      throw new Error("Expected apiFetch to throw");
    } catch (error) {
      expect(error.message).toBe("Request failed");
      expect(error.status).toBe(400);
    }
  });

  it("uses Request failed when the JSON response has an empty error", async () => {
    const response = {
      ok: false,
      status: 400,
      json: vi.fn().mockResolvedValue({
        error: "",
      }),
    };

    vi.spyOn(globalThis, "fetch").mockResolvedValue(response);

    await expect(
      apiFetch("/bad-request")
    ).rejects.toThrow("Request failed");
  });

  it("preserves additional fetch options", async () => {
    const response = {
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({
        success: true,
      }),
    };

    vi.spyOn(globalThis, "fetch").mockResolvedValue(response);

    await apiFetch("/test", {
      method: "PUT",
      body: JSON.stringify({
        name: "Updated",
      }),
      credentials: "include",
      cache: "no-store",
    });

    const [, options] = fetch.mock.calls[0];

    expect(options.method).toBe("PUT");
    expect(options.credentials).toBe("include");
    expect(options.cache).toBe("no-store");
    expect(options.body).toBe(
      JSON.stringify({
        name: "Updated",
      })
    );
  });

  it("does not set Content-Type when there is no body", async () => {
    const response = {
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({
        success: true,
      }),
    };

    vi.spyOn(globalThis, "fetch").mockResolvedValue(response);

    await apiFetch("/users");

    const [, options] = fetch.mock.calls[0];

    expect(options.headers.has("Content-Type")).toBe(false);
  });

  it("supports a Headers instance passed in options", async () => {
    const response = {
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({
        success: true,
      }),
    };

    vi.spyOn(globalThis, "fetch").mockResolvedValue(response);

    const headers = new Headers({
      "X-Test": "hello",
    });

    await apiFetch("/test", {
      headers,
    });

    const [, options] = fetch.mock.calls[0];

    expect(options.headers.get("X-Test")).toBe("hello");
  });

  it("adds Authorization while preserving existing headers", async () => {
    localStorage.setItem("token", "abc123");

    const response = {
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({
        success: true,
      }),
    };

    vi.spyOn(globalThis, "fetch").mockResolvedValue(response);

    await apiFetch("/protected", {
      headers: {
        "X-Client": "frontend",
      },
    });

    const [, options] = fetch.mock.calls[0];

    expect(options.headers.get("X-Client")).toBe(
      "frontend"
    );

    expect(options.headers.get("Authorization")).toBe(
      "Bearer abc123"
    );
  });

  it("uses the configured API path", async () => {
    const response = {
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({
        success: true,
      }),
    };

    vi.spyOn(globalThis, "fetch").mockResolvedValue(response);

    await apiFetch("/contact-forms");

    const [url] = fetch.mock.calls[0];

    expect(url).toMatch(
      /\/api\/contact-forms$/
    );
  });

  it("allows fetch to reject network errors", async () => {
    const networkError = new Error(
      "Network connection failed"
    );

    vi.spyOn(globalThis, "fetch").mockRejectedValue(
      networkError
    );

    await expect(
      apiFetch("/test")
    ).rejects.toThrow("Network connection failed");
  });
});


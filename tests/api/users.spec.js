const { test, expect } = require("../fixtures/database");

test("health endpoint works", async ({ request }) => {
  const response = await request.get("/health");

  expect(response.ok()).toBeTruthy();

  const body = await response.json();

  expect(body.status).toBe("ok");
});


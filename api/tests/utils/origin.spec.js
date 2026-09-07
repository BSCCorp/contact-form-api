const {
  test,
  expect,
} = require("../fixtures/database");

const {
  normalizeOrigin,
} = require("../../src/utils/origin.js");

test.describe("normalizeOrigin", () => {
  test("normalizes an origin", () => {
    expect(
      normalizeOrigin(
        " HTTPS://Example.COM/ "
      )
    ).toBe("https://example.com");
  });

  test("preserves a non-default port", () => {
    expect(
      normalizeOrigin(
        "https://example.com:8443/"
      )
    ).toBe("https://example.com:8443");
  });

  test("normalizes the default HTTPS port", () => {
    expect(
      normalizeOrigin(
        "https://example.com:443"
      )
    ).toBe("https://example.com");
  });

  test("rejects a path", () => {
    expect(() =>
      normalizeOrigin(
        "https://example.com/contact"
      )
    ).toThrow();
  });

  test("rejects a query string", () => {
    expect(() =>
      normalizeOrigin(
        "https://example.com?foo=bar"
      )
    ).toThrow();
  });

  test("rejects a fragment", () => {
    expect(() =>
      normalizeOrigin(
        "https://example.com/#contact"
      )
    ).toThrow();
  });

  test("rejects HTTP URLs with credentials", () => {
    expect(() =>
      normalizeOrigin(
        "https://user:password@example.com"
      )
    ).toThrow();
  });

  test("rejects non-HTTP protocols", () => {
    expect(() =>
      normalizeOrigin(
        "ftp://example.com"
      )
    ).toThrow();
  });

  test("rejects a hostname without a protocol", () => {
    expect(() =>
      normalizeOrigin(
        "example.com"
      )
    ).toThrow();
  });
});


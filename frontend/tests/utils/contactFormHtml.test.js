import { describe, expect, it } from "vitest";

import {
  generateContactFormHtml,
} from "../../src/utils/contactFormHtml";

describe("generateContactFormHtml", () => {
  it("generates a form using the account public ID", () => {
    const html = generateContactFormHtml(
      "abc123"
    );

    expect(html).toContain(
      'action="/api/contact-forms/public/abc123"'
    );

    expect(html).toContain(
      'method="POST"'
    );
  });

  it("contains the allowed origin as a hidden input", () => {
    const html = generateContactFormHtml(
      "abc123",
      "https://example.com"
    );

    expect(html).toContain(
      'type="hidden"'
    );

    expect(html).toContain(
      'name="allowedOrigin"'
    );

    expect(html).toContain(
      'value="https://example.com"'
    );
  });

  it("contains all required contact fields", () => {
    const html = generateContactFormHtml(
      "abc123"
    );

    expect(html).toContain(
      'name="name"'
    );

    expect(html).toContain(
      'name="email"'
    );

    expect(html).toContain(
      'name="subject"'
    );

    expect(html).toContain(
      'name="message"'
    );
  });

  it("does not expose SMTP credentials", () => {
    const html = generateContactFormHtml(
      "abc123"
    );

    expect(html).not.toContain("password");
    expect(html).not.toContain("username");
    expect(html).not.toContain("encryptedPassword");
  });

  it("does not expose the MongoDB user ID", () => {
    const html = generateContactFormHtml(
      "abc123"
    );

    expect(html).not.toContain("userId");
  });

  it("supports a separate API URL", () => {
    const html = generateContactFormHtml(
      "abc123",
      "https://example.com",
      "https://api.example.com"
    );

    expect(html).toContain(
      'action="https://api.example.com/api/contact-forms/public/abc123"'
    );
  });

  it("does not add a trailing slash to the API URL", () => {
    const html = generateContactFormHtml(
      "abc123",
      "https://example.com",
      "https://api.example.com"
    );

    expect(html).not.toContain(
      "api.example.com//api/"
    );
  });

  it("generates an absolute public contact form URL", () => {
    const html = generateContactFormHtml(
      "abc123",
      "https://example.com",
      "https://somesite.com/api"
    );

    expect(html).toContain(
      'action="https://somesite.com/api/contact-forms/public/abc123"'
    );
  });

  it("does not produce a double slash", () => {
    const html = generateContactFormHtml(
      "abc123",
      "https://example.com",
      "https://somesite.com/api/"
    );

    expect(html).toContain(
      'action="https://somesite.com/api/contact-forms/public/abc123"'
    );
  });

  it("escapes the allowed origin", () => {
    const html = generateContactFormHtml(
      "abc123",
      'https://example.com/?x="test"'
    );

    expect(html).toContain(
      'value="https://example.com/?x=&quot;test&quot;"'
    );
  });
});


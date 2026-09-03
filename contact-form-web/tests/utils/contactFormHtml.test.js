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
      "https://api.example.com"
    );

    expect(html).toContain(
      'action="https://api.example.com/api/contact-forms/public/abc123"'
    );
  });

  it("does not add a trailing slash to the API URL", () => {
    const html = generateContactFormHtml(
      "abc123",
      "https://api.example.com"
    );

    expect(html).not.toContain(
      "api.example.com//api/"
    );
  });
});


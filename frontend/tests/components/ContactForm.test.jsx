import { describe, expect, it } from "vitest";

import {
  getContactForms,
  getContactForm,
  createContactForm,
  deleteContactForm,
} from "../../src/api/contactForms";

describe("contact forms API", () => {
  it("lists contact forms", async () => {
    const result = await getContactForms();

    expect(result.data).toHaveLength(1);
    expect(result.data[0].name).toBe(
      "John Smith"
    );
  });

  it("gets a contact form", async () => {
    const result = await getContactForm(
      "contact-1"
    );

    expect(result.data.name).toBe(
      "John Smith"
    );

    expect(result.data.email).toBe(
      "john@example.com"
    );
  });

  it("creates a contact form", async () => {
    const result = await createContactForm({
      emailAccountId: "account-1",
      name: "John Smith",
      email: "john@example.com",
      subject: "I need help",
      message:
        "Please help me with my account.",
    });

    expect(result.data.name).toBe(
      "John Smith"
    );

    expect(result.data.email).toBe(
      "john@example.com"
    );

    expect(result.data.deliveryStatus).toBe(
      "sent"
    );
  });

  it("deletes a contact form", async () => {
    const result = await deleteContactForm(
      "contact-1"
    );

    expect(result).toBeNull();
  });

  it("handles a missing contact form", async () => {
    await expect(
      getContactForm("missing")
    ).rejects.toThrow(
      "Contact form not found"
    );
  });
});


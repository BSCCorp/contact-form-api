import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  cleanup,
  render,
  screen,
  act,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import ContactFormEmbed from "../../src/components/ContactFormEmbed";

describe("ContactFormEmbed", () => {
  let writeTextMock;

  beforeEach(() => {
    writeTextMock = vi.fn().mockResolvedValue(undefined);

    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: writeTextMock,
      },
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  function renderComponent() {
    return render(
      <ContactFormEmbed
        account={{
          publicId: "contact-form-public-123",
          allowedOrigin: "https://www.example.com",
        }}
      />
    );
  }

  it("renders the heading", () => {
    renderComponent();

    expect(
      screen.getByRole("heading", {
        name: /website contact form/i,
      })
    ).toBeInTheDocument();
  });

  it("renders the instructions", () => {
    renderComponent();

    expect(
      screen.getByText(
        /copy this html and paste it into your website/i
      )
    ).toBeInTheDocument();
  });

  it("renders the absolute public contact form endpoint", () => {
    renderComponent();

    const html =
      screen.getByLabelText("Contact form HTML").value;

    expect(html).toContain(
      `action="${window.location.origin}/api/contact-forms/public/contact-form-public-123"`
    );
  });

  it("generates a POST form", () => {
    renderComponent();

    const textarea =
      screen.getByLabelText("Contact form HTML");

    expect(textarea.value).toContain(
      'method="POST"'
    );
  });

  it("generates the correct public contact form endpoint", () => {
    renderComponent();

    const textarea =
      screen.getByLabelText("Contact form HTML");

    expect(textarea.value).toContain(
      "contact-forms/public/contact-form-public-123"
    );
  });

  it("includes the allowed origin as a hidden field", () => {
    renderComponent();

    const html =
      screen.getByLabelText("Contact form HTML").value;

    expect(html).toContain(
      'type="hidden"'
    );

    expect(html).toContain(
      'name="allowedOrigin"'
    );

    expect(html).toContain(
      'value="https://www.example.com"'
    );
  });

  it("includes the name field", () => {
    renderComponent();

    const html =
      screen.getByLabelText("Contact form HTML").value;

    expect(html).toContain('name="name"');
    expect(html).toContain('type="text"');
  });

  it("includes the email field", () => {
    renderComponent();

    const html =
      screen.getByLabelText("Contact form HTML").value;

    expect(html).toContain('name="email"');
    expect(html).toContain('type="email"');
  });

  it("includes the subject field", () => {
    renderComponent();

    const html =
      screen.getByLabelText("Contact form HTML").value;

    expect(html).toContain('name="subject"');
  });

  it("includes the message field", () => {
    renderComponent();

    const html =
      screen.getByLabelText("Contact form HTML").value;

    expect(html).toContain('name="message"');
    expect(html).toContain("<textarea");
  });

  it("includes required fields", () => {
    renderComponent();

    const html =
      screen.getByLabelText("Contact form HTML").value;

    expect(html).toContain('name="name"');
    expect(html).toContain('name="email"');
    expect(html).toContain('name="subject"');
    expect(html).toContain('name="message"');

    expect(
      (html.match(/required/g) || []).length
    ).toBeGreaterThanOrEqual(4);
  });

  it("does not expose SMTP credentials", () => {
    renderComponent();

    const html =
      screen
        .getByLabelText("Contact form HTML")
        .value
        .toLowerCase();

    expect(html).not.toContain("password");
    expect(html).not.toContain("username");
    expect(html).not.toContain("smtp");
    expect(html).not.toContain("encryptedpassword");
  });

  it("renders the Copy HTML button", () => {
    renderComponent();

    expect(
      screen.getByRole("button", {
        name: "Copy HTML",
      })
    ).toBeInTheDocument();
  });

  it("copies the generated HTML to the clipboard", async () => {
    renderComponent();

    const textarea =
      screen.getByLabelText("Contact form HTML");

    const button =
      screen.getByRole("button", {
        name: "Copy HTML",
      });

    await act(async () => {
      button.click();

      await Promise.resolve();
    });

    expect(writeTextMock).toHaveBeenCalledTimes(1);

    expect(writeTextMock).toHaveBeenCalledWith(
      textarea.value
    );
  });

  it("shows Copied after copying", async () => {
    const user = userEvent.setup();

    renderComponent();

    const button =
      screen.getByRole("button", {
        name: "Copy HTML",
      });

    await user.click(button);

    expect(
      screen.getByRole("button", {
        name: "Copied!",
      })
    ).toBeInTheDocument();
  });

  it("changes back to Copy HTML after 2 seconds", async () => {
    vi.useFakeTimers();

    renderComponent();

    const button = screen.getByRole("button", {
      name: "Copy HTML",
    });

    await act(async () => {
      button.click();

      await Promise.resolve();
    });

    expect(
      screen.getByRole("button", {
        name: "Copied!",
      })
    ).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(2000);
    });

    expect(
      screen.getByRole("button", {
        name: "Copy HTML",
      })
    ).toBeInTheDocument();
  });

  it("uses the account public ID in the generated HTML", () => {
    render(
      <ContactFormEmbed
        account={{
          publicId: "abc123",
          allowedOrigin: "https://www.example.com",
        }}
      />
    );

    const textarea =
      screen.getByLabelText("Contact form HTML");

    expect(textarea.value).toContain(
      "contact-forms/public/abc123"
    );

    expect(textarea.value).not.toContain(
      "contact-form-public-123"
    );
  });

  it("updates the generated HTML when the allowed origin changes", () => {
    const { rerender } = render(
      <ContactFormEmbed
        account={{
          publicId: "abc123",
          allowedOrigin: "https://old.example.com",
        }}
      />
    );

    let html =
      screen.getByLabelText("Contact form HTML").value;

    expect(html).toContain(
      'value="https://old.example.com"'
    );

    rerender(
      <ContactFormEmbed
        account={{
          publicId: "abc123",
          allowedOrigin: "https://new.example.com",
        }}
      />
    );

    html =
      screen.getByLabelText("Contact form HTML").value;

    expect(html).toContain(
      'value="https://new.example.com"'
    );

    expect(html).not.toContain(
      'value="https://old.example.com"'
    );
  });
});


import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import {
  MemoryRouter,
  Route,
  Routes,
} from "react-router-dom";
import { vi } from "vitest";

import ContactFormDetails from "../../src/pages/ContactFormDetails";
import * as contactFormsApi from "../../src/api/contactForms";

vi.mock("../../src/api/contactForms");

const contactForm = {
  _id: "contact-1",
  name: "John Smith",
  email: "john@example.com",
  subject: "I need help",
  message: "Please help me with my account.",
  deliveryStatus: "sent",
};

function renderPage(id = "contact-1") {
  return render(
    <MemoryRouter
      initialEntries={[
        `/contact-forms/${id}`,
      ]}
    >
      <Routes>
        <Route
          path="/contact-forms/:id"
          element={<ContactFormDetails />}
        />

        <Route
          path="/contact-forms"
          element={<div>Contact Forms</div>}
        />
      </Routes>
    </MemoryRouter>
  );
}

describe("ContactFormDetails", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading initially", () => {
    contactFormsApi.getContactForm.mockReturnValue(
      new Promise(() => {})
    );

    renderPage();

    expect(
      screen.getByText("Loading...")
    ).toBeInTheDocument();
  });

  it("renders contact form details", async () => {
    contactFormsApi.getContactForm.mockResolvedValue(
      contactForm
    );

    renderPage();

    expect(
      await screen.findByRole("heading", {
        name: "I need help",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText("John Smith")
    ).toBeInTheDocument();

    expect(
      screen.getByText("john@example.com")
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Please help me with my account."
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText("sent")
    ).toBeInTheDocument();
  });

  it("shows delivery errors", async () => {
    contactFormsApi.getContactForm.mockResolvedValue({
      ...contactForm,
      deliveryError: "SMTP failed",
    });

    renderPage();

    expect(
      await screen.findByText("SMTP failed")
    ).toBeInTheDocument();
  });

  it("shows an API error", async () => {
    contactFormsApi.getContactForm.mockRejectedValue(
      new Error("Contact form not found")
    );

    renderPage();

    expect(
      await screen.findByText(
        "Contact form not found"
      )
    ).toBeInTheDocument();
  });

  it("links back to contact forms", async () => {
    contactFormsApi.getContactForm.mockResolvedValue(
      contactForm
    );

    renderPage();

    expect(
      await screen.findByRole("link", {
        name: /back/i,
      })
    ).toHaveAttribute(
      "href",
      "/contact-forms"
    );
  });

  it("deletes the contact form and navigates back", async () => {
    contactFormsApi.getContactForm.mockResolvedValue(
      contactForm
    );

    contactFormsApi.deleteContactForm.mockResolvedValue(
      {}
    );

    vi.spyOn(window, "confirm").mockReturnValue(
      true
    );

    renderPage();

    fireEvent.click(
      await screen.findByRole("button", {
        name: /delete/i,
      })
    );

    await waitFor(() => {
      expect(
        contactFormsApi.deleteContactForm
      ).toHaveBeenCalledWith("contact-1");
    });

    expect(
      await screen.findByText("Contact Forms")
    ).toBeInTheDocument();
  });
});


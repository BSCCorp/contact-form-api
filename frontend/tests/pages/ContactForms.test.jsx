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

import ContactForms from "../../src/pages/ContactForms";
import * as contactFormsApi from "../../src/api/contactForms";

vi.mock("../../src/api/contactForms");

const contactForm = {
  _id: "contact-1",
  userId: "user-1",
  emailAccountId: "account-1",
  name: "John Smith",
  email: "john@example.com",
  subject: "I need help",
  message: "Please help me.",
  deliveryStatus: "sent",
};

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/contact-forms"]}>
      <Routes>
        <Route
          path="/contact-forms"
          element={<ContactForms />}
        />
        <Route
          path="/contact-forms/:id"
          element={<div>Details</div>}
        />
      </Routes>
    </MemoryRouter>
  );
}

describe("ContactForms", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading initially", () => {
    contactFormsApi.getContactForms.mockReturnValue(
      new Promise(() => {})
    );

    renderPage();

    expect(
      screen.getByText("Loading...")
    ).toBeInTheDocument();
  });

  it("renders contact form submissions", async () => {
    contactFormsApi.getContactForms.mockResolvedValue([
      contactForm,
    ]);

    renderPage();

    expect(
      await screen.findByText("John Smith")
    ).toBeInTheDocument();

    expect(
      screen.getByText("john@example.com")
    ).toBeInTheDocument();

    expect(
      screen.getByText("I need help")
    ).toBeInTheDocument();

    expect(
      screen.getByText("sent")
    ).toBeInTheDocument();
  });

  it("shows the empty state", async () => {
    contactFormsApi.getContactForms.mockResolvedValue(
      []
    );

    renderPage();

    expect(
      await screen.findByText(
        /no contact forms yet/i
      )
    ).toBeInTheDocument();
  });

  it("shows an API error", async () => {
    contactFormsApi.getContactForms.mockRejectedValue(
      new Error("Failed to load contact forms")
    );

    renderPage();

    expect(
      await screen.findByText(
        "Failed to load contact forms"
      )
    ).toBeInTheDocument();
  });

  it("links to contact form details", async () => {
    contactFormsApi.getContactForms.mockResolvedValue([
      contactForm,
    ]);

    renderPage();

    expect(
      await screen.findByRole("link", {
        name: /view/i,
      })
    ).toHaveAttribute(
      "href",
      "/contact-forms/contact-1"
    );
  });

  it("deletes a contact form", async () => {
    contactFormsApi.getContactForms.mockResolvedValue([
      contactForm,
    ]);

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
      screen.queryByText("John Smith")
    ).not.toBeInTheDocument();
  });
});


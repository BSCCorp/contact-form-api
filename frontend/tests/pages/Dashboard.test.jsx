import {
  render,
  screen,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import Dashboard from "../../src/pages/Dashboard";

vi.mock(
  "../../src/context/AuthContext",
  () => ({
    useAuth: () => ({
      user: {
        name: "Jane Doe",
      },
    }),
  })
);

describe("Dashboard", () => {
  it("displays the welcome message", () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", {
        name: /dashboard/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/welcome back, jane doe/i)
    ).toBeInTheDocument();
  });

  it("links to email accounts", () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("link", {
        name: /email accounts/i,
      })
    ).toHaveAttribute(
      "href",
      "/email-accounts"
    );
  });

  it("links to contact forms", () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("link", {
        name: /contact forms/i,
      })
    ).toHaveAttribute(
      "href",
      "/contact-forms"
    );
  });
});


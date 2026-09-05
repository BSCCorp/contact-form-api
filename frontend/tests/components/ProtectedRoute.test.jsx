import { render, screen } from "@testing-library/react";
import {
  MemoryRouter,
  Route,
  Routes,
} from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import ProtectedRoute from "../../src/components/ProtectedRoute";
import { useAuth } from "../../src/context/AuthContext";

vi.mock("../../src/context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

function renderProtectedRoute(auth, initialRoute = "/protected") {
  useAuth.mockReturnValue(auth);

  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route
          path="/protected"
          element={
            <ProtectedRoute>
              <div>Protected page</div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/login"
          element={<div>Login page</div>}
        />
      </Routes>
    </MemoryRouter>
  );
}

describe("ProtectedRoute", () => {
  it("shows loading while authentication is loading", () => {
    renderProtectedRoute({
      user: null,
      loading: true,
    });

    expect(
      screen.getByText("Loading...")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Protected page")
    ).not.toBeInTheDocument();
  });

  it("redirects unauthenticated users to login", () => {
    renderProtectedRoute({
      user: null,
      loading: false,
    });

    expect(
      screen.getByText("Login page")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Protected page")
    ).not.toBeInTheDocument();
  });

  it("renders children for authenticated users", () => {
    renderProtectedRoute({
      user: {
        id: "user-1",
        name: "Jane Doe",
        email: "jane@example.com",
      },
      loading: false,
    });

    expect(
      screen.getByText("Protected page")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Login page")
    ).not.toBeInTheDocument();
  });
});

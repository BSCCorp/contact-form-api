import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <h1>Contact Forms</h1>

        <nav>
          <NavLink to="/">
            Dashboard
          </NavLink>

          <NavLink to="/email-accounts">
            Email Accounts
          </NavLink>

          <NavLink to="/contact-forms">
            Contact Forms
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="user-name">
            {user?.name}
          </div>

          <div className="user-email">
            {user?.email}
          </div>

          <button onClick={handleLogout}>
            Log out
          </button>
        </div>
      </aside>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}


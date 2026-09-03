import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <>
      <div className="page-header">
        <div>
          <h2>Dashboard</h2>
          <p>
            Welcome back, {user.name}.
          </p>
        </div>
      </div>

      <div className="dashboard-grid">
        <Link
          className="dashboard-card"
          to="/email-accounts"
        >
          <h3>Email Accounts</h3>
          <p>
            Configure and test your SMTP
            accounts.
          </p>
        </Link>

        <Link
          className="dashboard-card"
          to="/contact-forms"
        >
          <h3>Contact Forms</h3>
          <p>
            View contact form submissions
            and their delivery status.
          </p>
        </Link>
      </div>
    </>
  );
}


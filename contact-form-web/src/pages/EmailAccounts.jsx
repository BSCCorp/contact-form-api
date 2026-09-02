import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import * as emailAccountsApi from "../api/emailAccounts";

export default function EmailAccounts() {
  const [accounts, setAccounts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadAccounts();
  }, []);

  async function loadAccounts() {
    try {
      const result =
        await emailAccountsApi
          .getEmailAccounts();

      setAccounts(result.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (
      !window.confirm(
        "Delete this email account?"
      )
    ) {
      return;
    }

    try {
      await emailAccountsApi
        .deleteEmailAccount(id);

      setAccounts((current) =>
        current.filter(
          (account) =>
            account._id !== id
        )
      );
    } catch (error) {
      setError(error.message);
    }
  }

  async function handleTest(id) {
    try {
      await emailAccountsApi
        .testEmailAccount(id);

      alert("SMTP connection successful.");
    } catch (error) {
      alert(error.message);
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h2>Email Accounts</h2>
          <p>
            Manage the SMTP accounts used
            to send contact forms.
          </p>
        </div>

        <Link
          className="button"
          to="/email-accounts/new"
        >
          Add account
        </Link>
      </div>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {accounts.length === 0 ? (
        <div className="empty">
          <h3>No email accounts</h3>
          <p>
            Add an SMTP account to start
            sending contact forms.
          </p>
        </div>
      ) : (
        <div className="card-list">
          {accounts.map((account) => (
            <div
              className="card"
              key={account._id}
            >
              <div>
                <h3>{account.name}</h3>

                <p>
                  {account.host}:
                  {account.port}
                </p>

                <p>
                  {account.username}
                </p>

                <p>
                  From: {account.from}
                </p>
              </div>

              <div className="actions">
                <button
                  onClick={() =>
                    handleTest(
                      account._id
                    )
                  }
                >
                  Test SMTP
                </button>

                <Link
                  className="button secondary"
                  to={`/email-accounts/${account._id}/edit`}
                >
                  Edit
                </Link>

                <button
                  className="danger"
                  onClick={() =>
                    handleDelete(
                      account._id
                    )
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}


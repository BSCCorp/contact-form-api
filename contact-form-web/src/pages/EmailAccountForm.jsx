import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import * as emailAccountsApi from "../api/emailAccounts";

const initialForm = {
  name: "",
  host: "",
  port: 1025,
  secure: false,
  username: "",
  password: "",
  from: "",
};

export default function EmailAccountForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const editing = Boolean(id);

  const [form, setForm] =
    useState(initialForm);

  const [loading, setLoading] =
    useState(editing);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!editing) {
      return;
    }

    emailAccountsApi
      .getEmailAccount(id)
      .then((result) => {
        setForm({
          ...initialForm,
          ...result.data,
          password: "",
        });
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, editing]);

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSaving(true);

    try {
      const data = {
        name: form.name,
        host: form.host,
        port: Number(form.port),
        secure: form.secure,
        username: form.username,
        from: form.from,
      };

      // Don't send an empty password during
      // an update.
      if (form.password) {
        data.password = form.password;
      }

      if (editing) {
        await emailAccountsApi
          .updateEmailAccount(id, data);
      } else {
        data.password = form.password;

        await emailAccountsApi
          .createEmailAccount(data);
      }

      navigate("/email-accounts");
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h2>
            {editing
              ? "Edit Email Account"
              : "Add Email Account"}
          </h2>
        </div>
      </div>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      <form
        className="form-card"
        onSubmit={handleSubmit}
      >
        <label>
          Name
          <input
            value={form.name}
            onChange={(event) =>
              updateField(
                "name",
                event.target.value
              )
            }
            required
          />
        </label>

        <label>
          SMTP Host
          <input
            value={form.host}
            onChange={(event) =>
              updateField(
                "host",
                event.target.value
              )
            }
            required
          />
        </label>

        <label>
          Port
          <input
            type="number"
            value={form.port}
            onChange={(event) =>
              updateField(
                "port",
                event.target.value
              )
            }
            required
          />
        </label>

        <label>
          Username
          <input
            value={form.username}
            onChange={(event) =>
              updateField(
                "username",
                event.target.value
              )
            }
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={(event) =>
              updateField(
                "password",
                event.target.value
              )
            }
            required={!editing}
            placeholder={
              editing
                ? "Leave blank to keep current password"
                : ""
            }
          />
        </label>

        <label>
          From address
          <input
            type="email"
            value={form.from}
            onChange={(event) =>
              updateField(
                "from",
                event.target.value
              )
            }
          />
        </label>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={form.secure}
            onChange={(event) =>
              updateField(
                "secure",
                event.target.checked
              )
            }
          />

          Use secure SMTP
        </label>

        <div className="form-actions">
          <button
            type="button"
            className="secondary"
            onClick={() =>
              navigate("/email-accounts")
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save account"}
          </button>
        </div>
      </form>
    </>
  );
}


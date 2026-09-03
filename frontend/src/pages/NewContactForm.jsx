import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getEmailAccounts } from "../api/emailAccounts";
import { createContactForm } from "../api/contactForms";

export default function NewContactForm() {
  const navigate = useNavigate();

  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [form, setForm] = useState({
    emailAccountId: "",
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    async function load() {
      try {
        const body = await getEmailAccounts();

        setAccounts(body.data);

        if (body.data.length > 0) {
          setForm((current) => ({
            ...current,
            emailAccountId: body.data[0]._id,
          }));
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  function change(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function submit(event) {
    event.preventDefault();

    setError("");
    setSending(true);

    try {
      await createContactForm(form);

      navigate("/contact-forms");
    } catch (error) {
      setError(error.message);
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Send contact form</h1>
          <p className="muted">
            Send a message through one of your SMTP
            accounts.
          </p>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {accounts.length === 0 ? (
        <div className="card">
          <h2>No sending account</h2>
          <p>
            You need to configure an email account
            before sending a contact form.
          </p>
        </div>
      ) : (
        <form className="card form" onSubmit={submit}>
          <label>
            Sending account
            <select
              name="emailAccountId"
              value={form.emailAccountId}
              onChange={change}
              required
            >
              {accounts.map((account) => (
                <option
                  key={account._id}
                  value={account._id}
                >
                  {account.name} ({account.username})
                </option>
              ))}
            </select>
          </label>

          <label>
            Name
            <input
              name="name"
              value={form.name}
              onChange={change}
              required
            />
          </label>

          <label>
            Contact email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={change}
              required
            />
          </label>

          <label>
            Subject
            <input
              name="subject"
              value={form.subject}
              onChange={change}
              required
            />
          </label>

          <label>
            Message
            <textarea
              name="message"
              rows="8"
              value={form.message}
              onChange={change}
              required
            />
          </label>

          <button disabled={sending}>
            {sending ? "Sending..." : "Send message"}
          </button>
        </form>
      )}
    </>
  );
}


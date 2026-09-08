import { useState } from "react";

const emptyForm = {
  name: "",
  host: "",
  port: 587,
  secure: false,
  username: "",
  password: "",
  from: "",
  allowedOrigin: "",
};

export default function EmailAccountForm({
  initialValues = emptyForm,
  onSubmit,
  onCancel,
  submitting = false,
}) {
  const [form, setForm] = useState({
    ...emptyForm,
    ...initialValues,
  });

  function change(event) {
    const { name, value, type, checked } = event.target;

    setForm({
      ...form,
      [name]:
        type === "checkbox"
          ? checked
          : name === "port"
            ? Number(value)
            : value,
    });
  }

  async function submit(event) {
    event.preventDefault();

    const {
      name,
      host,
      port,
      secure,
      username,
      password,
      from,
      allowedOrigin,
    } = form;

    const data = {
      name,
      host,
      port,
      secure,
      username,
      from,
      allowedOrigin,
    };

    // An empty password means don't change it
    // when editing an existing account.
    if (password) {
      data.password = password;
    }

    await onSubmit(data);
  }

  return (
    <form className="form-card email-account-form" onSubmit={submit}>
      <label>
        Account name
        <input
          name="name"
          value={form.name}
          onChange={change}
          required
        />
      </label>

      <div className="form-row">
        <label>
          SMTP host
          <input
            name="host"
            value={form.host}
            onChange={change}
            required
          />
        </label>

        <label>
          Port
          <input
            name="port"
            type="number"
            value={form.port}
            onChange={change}
            required
          />
        </label>
      </div>

      <label className="checkbox">
        <input
          name="secure"
          type="checkbox"
          checked={form.secure}
          onChange={change}
        />
        Use secure connection
      </label>

      <label>
        Username
        <input
          name="username"
          value={form.username}
          onChange={change}
          required
        />
      </label>

      <label>
        Password
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={change}
          placeholder={
            initialValues._id
              ? "Leave blank to keep existing password"
              : ""
          }
          required={!initialValues._id}
        />
      </label>

      <label>
        From address
        <input
          name="from"
          type="email"
          value={form.from}
          onChange={change}
        />
      </label>

      <label>
        Allowed origin
        <input
          name="allowedOrigin"
          type="url"
          value={form.allowedOrigin}
          onChange={change}
          placeholder="https://example.com"
        />
      </label>

      <div className="actions">
        <button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save account"}
        </button>

        {onCancel && (
          <button
            type="button"
            className="button-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}


import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import * as emailAccountsApi from "../api/emailAccounts";

import EmailAccountForm from "../components/EmailAccountForm";
import ContactFormEmbed from "../components/ContactFormEmbed";

const initialForm = {
  name: "",
  host: "",
  port: 587,
  secure: false,
  username: "",
  password: "",
  from: "",
  allowedOrigin: "",
};

export default function EmailAccount() {
  const { id } = useParams();
  const navigate = useNavigate();

  const editing = Boolean(id);

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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

  async function handleSubmit(data) {
    setSaving(true);
    setError("");

    try {
      if (editing) {
        await emailAccountsApi.updateEmailAccount(id, data);
      } else {
        await emailAccountsApi.createEmailAccount(data);
      }

      navigate("/email-accounts");
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    navigate("/email-accounts");
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

      <EmailAccountForm
        initialValues={form}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitting={saving}
      />

      {editing && form.publicId && (
        <ContactFormEmbed account={form} />
      )}
    </>
  );
}


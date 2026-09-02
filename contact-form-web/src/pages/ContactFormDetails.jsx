import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import * as contactFormsApi from "../api/contactForms";

export default function ContactFormDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    contactFormsApi
      .getContactForm(id)
      .then((result) => {
        setForm(result);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  async function handleDelete() {
    if (
      !window.confirm(
        "Delete this contact form?"
      )
    ) {
      return;
    }

    try {
      await contactFormsApi
        .deleteContactForm(id);

      navigate("/contact-forms");
    } catch (error) {
      setError(error.message);
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return (
      <div className="error">
        {error}
      </div>
    );
  }

  if (!form) {
    return null;
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h2>{form.subject}</h2>
          <p>
            Submitted by {form.name}
          </p>
        </div>

        <Link to="/contact-forms">
          Back
        </Link>
      </div>

      <div className="detail-card">
        <div className="detail-row">
          <strong>Name</strong>
          <span>{form.name}</span>
        </div>

        <div className="detail-row">
          <strong>Email</strong>
          <span>{form.email}</span>
        </div>

        <div className="detail-row">
          <strong>Subject</strong>
          <span>{form.subject}</span>
        </div>

        <div className="detail-row">
          <strong>Status</strong>
          <span
            className={`status ${form.deliveryStatus}`}
          >
            {form.deliveryStatus}
          </span>
        </div>

        {form.deliveryError && (
          <div className="detail-row">
            <strong>Delivery error</strong>
            <span className="error-text">
              {form.deliveryError}
            </span>
          </div>
        )}

        <hr />

        <div className="message">
          {form.message}
        </div>

        <div className="form-actions">
          <button
            className="danger"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
}


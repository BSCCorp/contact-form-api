import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import * as contactFormsApi from "../api/contactForms";

export default function ContactForms() {
  const [forms, setForms] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadForms();
  }, []);

  async function loadForms() {
    try {
      const result =
        await contactFormsApi
          .getContactForms();

      setForms(result);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
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

      setForms((current) =>
        current.filter(
          (form) => form._id !== id
        )
      );
    } catch (error) {
      setError(error.message);
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h2>Contact Forms</h2>
          <p>
            Contact form submissions sent
            through your SMTP accounts.
          </p>
        </div>
      </div>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {forms.length === 0 ? (
        <div className="empty">
          No contact forms yet.
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {forms.map((form) => (
                <tr key={form._id}>
                  <td>{form.name}</td>

                  <td>{form.email}</td>

                  <td>{form.subject}</td>

                  <td>
                    <span
                      className={`status ${form.deliveryStatus}`}
                    >
                      {form.deliveryStatus}
                    </span>
                  </td>

                  <td>
                    <div className="actions">
                      <Link
                        to={`/contact-forms/${form._id}`}
                      >
                        View
                      </Link>

                      <button
                        className="danger"
                        onClick={() =>
                          handleDelete(
                            form._id
                          )
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}


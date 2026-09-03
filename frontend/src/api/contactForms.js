import { apiFetch } from "./client";

export function getContactForms() {
  return apiFetch("/contact-forms");
}

export function getContactForm(id) {
  return apiFetch(
    `/contact-forms/${id}`
  );
}

export function createContactForm(data) {
  return apiFetch("/contact-forms", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function deleteContactForm(id) {
  return apiFetch(
    `/contact-forms/${id}`,
    {
      method: "DELETE",
    }
  );
}


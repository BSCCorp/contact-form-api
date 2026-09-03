import { apiFetch } from "./client";

export function getEmailAccounts() {
  return apiFetch("/email-accounts");
}

export function getEmailAccount(id) {
  return apiFetch(
    `/email-accounts/${id}`
  );
}

export function createEmailAccount(data) {
  return apiFetch("/email-accounts", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateEmailAccount(id, data) {
  return apiFetch(
    `/email-accounts/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
}

export function deleteEmailAccount(id) {
  return apiFetch(
    `/email-accounts/${id}`,
    {
      method: "DELETE",
    }
  );
}

export function testEmailAccount(id) {
  return apiFetch(
    `/email-accounts/${id}/test`,
    {
      method: "POST",
    }
  );
}


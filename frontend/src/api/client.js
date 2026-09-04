const API_URL =
  import.meta.env.VITE_API_URL ||
  "/api";

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");

  const headers = new Headers(options.headers);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set(
      "Authorization",
      `Bearer ${token}`
    );
  }

  const response = await fetch(
    `${API_URL}${path}`,
    {
      ...options,
      headers,
    }
  );

  if (!response.ok) {
    let message = "Request failed";

    try {
      const body = await response.json();
      message = body.error || message;
    } catch {
      // Response wasn't JSON.
    }

    const error = new Error(message);
    error.status = response.status;

    throw error;
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}


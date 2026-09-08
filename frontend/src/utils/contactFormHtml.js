function escapeHtmlAttribute(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildPublicContactFormAction(
  publicId,
  apiUrl
) {
  const path =
    `/contact-forms/public/${encodeURIComponent(publicId)}`;

  if (!apiUrl) {
    return `/api${path}`;
  }

  const normalizedApiUrl =
    String(apiUrl).replace(/\/+$/, "");

  if (normalizedApiUrl.endsWith("/api")) {
    return `${normalizedApiUrl}${path}`;
  }

  return `${normalizedApiUrl}/api${path}`;
}

function generateContactFormHtml(
  publicId,
  allowedOrigin,
  apiUrl
) {
  const action = buildPublicContactFormAction(
    publicId,
    apiUrl
  );

  const escapedAction =
    escapeHtmlAttribute(action);

  const escapedAllowedOrigin =
    escapeHtmlAttribute(
      allowedOrigin || ""
    );

  return `<form action="${escapedAction}" method="POST">
  <input
    type="hidden"
    name="allowedOrigin"
    value="${escapedAllowedOrigin}"
  />

  <div>
    <label for="contact-name">Name</label>
    <input
      id="contact-name"
      name="name"
      type="text"
      maxlength="100"
      required
    />
  </div>

  <div>
    <label for="contact-email">Email</label>
    <input
      id="contact-email"
      name="email"
      type="email"
      maxlength="320"
      required
    />
  </div>

  <div>
    <label for="contact-subject">Subject</label>
    <input
      id="contact-subject"
      name="subject"
      type="text"
      maxlength="200"
      required
    />
  </div>

  <div>
    <label for="contact-message">Message</label>
    <textarea
      id="contact-message"
      name="message"
      maxlength="5000"
      required
    ></textarea>
  </div>

  <button type="submit">Send message</button>
</form>`;
}

module.exports = {
  generateContactFormHtml,
};

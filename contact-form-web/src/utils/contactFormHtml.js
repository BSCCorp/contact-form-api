function generateContactFormHtml(
  publicId,
  apiUrl = ""
) {
  let baseUrl = apiUrl.replace(/\/+$/, "");

  if (!baseUrl.endsWith("/api")) {
    baseUrl += "/api";
  }

  const action = `${baseUrl}/contact-forms/public/${publicId}`;

  return `<form action="${action}" method="POST">
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


import { useMemo, useState } from "react";
import { generateContactFormHtml } from "../utils/contactFormHtml";

function ContactFormEmbed({ account }) {
  const [copied, setCopied] = useState(false);

  const apiUrl =
    import.meta.env.VITE_API_URL || "";

  const html = useMemo(() => {
    return generateContactFormHtml(
      account.publicId,
      apiUrl
    );
  }, [account.publicId, apiUrl]);

  async function copyHtml() {
    await navigator.clipboard.writeText(html);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <section>
      <h2>Website contact form</h2>

      <p>
        Copy this HTML and paste it into your website.
      </p>

      <textarea
        readOnly
        value={html}
        rows={24}
        cols={80}
        aria-label="Contact form HTML"
      />

      <button type="button" onClick={copyHtml}>
        {copied ? "Copied!" : "Copy HTML"}
      </button>
    </section>
  );
}

export default ContactFormEmbed;


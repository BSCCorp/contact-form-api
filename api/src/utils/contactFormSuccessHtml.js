function escapeHtmlAttribute(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeJavaScriptString(value) {
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'")
    .replace(/\r/g, "\\r")
    .replace(/\n/g, "\\n")
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

function generateContactFormSuccessHtml(
  allowedOrigin = ""
) {
  const hasRedirectOrigin =
    Boolean(allowedOrigin);

  const escapedOrigin =
    escapeHtmlAttribute(allowedOrigin);

  const escapedJavaScriptOrigin =
    escapeJavaScriptString(allowedOrigin);

  const redirectScript = hasRedirectOrigin
    ? `
<script>
    setTimeout(() => {
        window.location.href = "${escapedJavaScriptOrigin}";
    }, 5000);
</script>`
    : "";

  const returnLink = hasRedirectOrigin
    ? `
        <a href="${escapedOrigin}">
            Return now
        </a>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>Message sent</title>

    <style>
        :root{
            --bg:#0b0d10;
            --panel:#12161b;
            --text:#e8edf2;
            --muted:#a6b0bb;
            --accent:#00d4aa;
            --accent-hover:#16f0c2;
            --border:#20262d;
        }

        *{
            margin:0;
            padding:0;
            box-sizing:border-box;
        }

        html{
            scroll-behavior:smooth;
        }

        body{
            min-height:100vh;
            display:flex;
            flex-direction:column;
            font-family:Inter,-apple-system,BlinkMacSystemFont,
                "Segoe UI",sans-serif;
            background:var(--bg);
            color:var(--text);
            line-height:1.7;
        }

        main{
            flex:1;
            display:flex;
            align-items:center;
            justify-content:center;
            padding:60px 20px;
            background:
                radial-gradient(
                    circle at top center,
                    rgba(0,212,170,.12),
                    transparent 55%
                );
        }

        main > div{
            width:90%;
            max-width:600px;
            padding:45px 35px;
            text-align:center;
            background:var(--panel);
            border:1px solid var(--border);
            border-radius:16px;
            box-shadow:0 20px 60px rgba(0,0,0,.2);
        }

        main > div > div{
            width:64px;
            height:64px;
            display:flex;
            align-items:center;
            justify-content:center;
            margin:0 auto 25px;
            border:1px solid rgba(0,212,170,.3);
            border-radius:50%;
            background:rgba(0,212,170,.08);
            color:var(--accent);
            font-size:1.8rem;
        }

        h1{
            margin-bottom:15px;
            font-size:clamp(2rem,5vw,3rem);
            line-height:1.1;
        }

        p{
            margin-bottom:15px;
            color:var(--muted);
        }

        a{
            display:inline-block;
            margin-top:15px;
            padding:12px 24px;
            border-radius:8px;
            background:var(--accent);
            color:#000;
            font-weight:600;
            text-decoration:none;
            transition:.2s;
        }

        a:hover{
            background:var(--accent-hover);
        }

        footer{
            padding:30px 20px;
            text-align:center;
            border-top:1px solid var(--border);
            color:var(--muted);
            font-size:.9rem;
        }

        @media (max-width:600px){
            main > div{
                padding:35px 22px;
            }
        }
    </style>
</head>

<body>

<main>
    <div>
        <div aria-hidden="true">✓</div>

        <h1>Message sent</h1>

        <p>
            Thanks for getting in touch. Your message has been
            received successfully.
        </p>

        ${
          hasRedirectOrigin
            ? `
        <p>
            You will be returned to the previous page in 5 seconds.
        </p>
        `
            : ""
        }

        ${returnLink}
    </div>
</main>

<footer>
    &copy; ${new Date().getFullYear()}
</footer>

${redirectScript}

</body>
</html>`;
}

module.exports = {
  generateContactFormSuccessHtml,
};


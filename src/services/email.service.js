const nodemailer = require("nodemailer");

function createTransport({
  host,
  port,
  secure,
  username,
  password,
}) {
  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user: username,
      pass: password,
    },
  });
}

async function sendMail(
  smtpConfig,
  message
) {
  const transporter =
    createTransport(smtpConfig);

  return transporter.sendMail(message);
}

async function verifySmtp(smtpConfig) {
  const transporter =
    createTransport(smtpConfig);

  await transporter.verify();
}

module.exports = {
  createTransport,
  sendMail,
  verifySmtp,
};


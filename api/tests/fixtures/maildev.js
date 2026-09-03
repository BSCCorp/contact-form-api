const MAILDEV_URL =
  process.env.MAILDEV_URL ||
  "http://127.0.0.1:1080/api";

async function clearMaildev(request) {
  const response = await request.delete(
    `${MAILDEV_URL}/email/all`
  );

  if (!response.ok()) {
    throw new Error(
      `Failed to clear MailDev: ${response.status()}`
    );
  }
}

async function getMaildevEmails(request) {
  const response = await request.get(
    `${MAILDEV_URL}/email`
  );

  if (!response.ok()) {
    throw new Error(
      `Failed to retrieve MailDev emails: ${response.status()}`
    );
  }

  return response.json();
}

async function getMaildevEmail(request, id) {
  const response = await request.get(
    `${MAILDEV_URL}/email/${id}`
  );

  if (!response.ok()) {
    throw new Error(
      `Failed to retrieve MailDev email: ${response.status()}`
    );
  }

  return response.json();
}

async function waitForMail(
  request,
  {
    timeout = 5000,
    interval = 100,
  } = {}
) {
  const deadline = Date.now() + timeout;

  while (Date.now() < deadline) {
    const emails = await getMaildevEmails(request);

    if (emails.length > 0) {
      return emails;
    }

    await new Promise((resolve) =>
      setTimeout(resolve, interval)
    );
  }

  throw new Error(
    `Timed out waiting for MailDev email after ${timeout}ms`
  );
}

async function getMaildevRawEmail(request, id) {
  const response = await request.get(
    `${MAILDEV_URL}/email/${id}/source`
  );

  if (!response.ok()) {
    throw new Error(
      `Failed to retrieve raw MailDev email: ${response.status()}`
    );
  }

  return response.text();
}


module.exports = {
  clearMaildev,
  getMaildevEmails,
  getMaildevEmail,
  waitForMail,
  getMaildevRawEmail,
};


const EmailAccount = require("./emailAccount.model");
const AppError = require("../../utils/AppError");
const { verifySmtp } = require("../../services/email.service.js");
const {
  normalizeOrigin,
} = require("../../utils/origin.js");


const {
  encrypt,
  decrypt,
} = require("../../utils/encryption");

async function createEmailAccount(userId, data) {
  const {
    password,
    from,
    allowedOrigin,
    ...rest
  } = data;

  let normalizedAllowedOrigin;

  if (allowedOrigin) {
    try {
      normalizedAllowedOrigin =
        normalizeOrigin(allowedOrigin);
    } catch (error) {
      throw new AppError(
        "Invalid allowed origin",
        400
      );
    }
  }

  const emailAccount =
    await EmailAccount.create({
      ...rest,
      userId,
      allowedOrigin: normalizedAllowedOrigin,
      from: from || data.username,
      encryptedPassword: encrypt(password),
    });

  return sanitize(emailAccount);
}

async function getEmailAccounts(userId) {
  const accounts = await EmailAccount.find({
    userId,
  }).sort({ createdAt: -1 });

  return accounts.map(sanitize);
}

async function getEmailAccount(
  userId,
  accountId
) {
  const account =
    await EmailAccount.findOne({
      _id: accountId,
      userId,
    });

  if (!account) {
    throw new AppError(
      "Email account not found",
      404
    );
  }

  return sanitize(account);
}

async function getEmailAccountCredentials(
  userId,
  accountId
) {
  const account =
    await EmailAccount.findOne({
      _id: accountId,
      userId,
    });

  if (!account) {
    throw new AppError(
      "Email account not found",
      404
    );
  }

  return {
    host: account.host,
    port: account.port,
    secure: account.secure,
    username: account.username,
    password: decrypt(
      account.encryptedPassword
    ),
    from: account.from || account.username,
  };
}

async function getEmailAccountForSending(userId, emailAccountId) {
  const account = await EmailAccount.findOne({
    _id: emailAccountId,
    userId,
  });

  if (!account) {
    throw new AppError(
      "Email account not found",
      404
    );
  }

  return {
    ...account.toObject(),
    password: decrypt(account.encryptedPassword),
  };
}

async function getPublicEmailAccountForSending(
  publicId,
  requestOrigin
) {
  const account = await EmailAccount.findOne({
    publicId,
  });

  if (!account) {
    throw new AppError(
      "Email account not found",
      404
    );
  }

  // Origin is optional.
  if (requestOrigin) {
    let normalizedOrigin;

    try {
      normalizedOrigin =
        normalizeOrigin(requestOrigin);
    } catch {
      throw new AppError(
        "Invalid origin",
        403
      );
    }

    if (
      normalizedOrigin !==
      account.allowedOrigin
    ) {
      throw new AppError(
        "Origin not allowed",
        403
      );
    }
  }

  return {
    ...account.toObject(),
    password: decrypt(account.encryptedPassword),
  };
}

async function updateEmailAccount(
  userId,
  accountId,
  data
) {
  const {
    password,
    ...updates
  } = data;

  if (password) {
    updates.encryptedPassword = encrypt(password);
  }

  const account =
    await EmailAccount.findOneAndUpdate(
      {
        _id: accountId,
        userId,
      },
      updates,
      {
        returnDocument: "after",
        runValidators: true,
      }
    ).lean();

  if (!account) {
    throw new AppError(
      "Email account not found",
      404
    );
  }

  delete account.encryptedPassword;

  return account;
}

async function deleteEmailAccount(userId, accountId) {
  const account = await EmailAccount.findOneAndDelete({
    _id: accountId,
    userId,
  });

  if (!account) {
    throw new AppError("Email account not found", 404);
  }
}

async function testEmailAccount(userId, accountId) {
  const account = await getEmailAccountForSending(
    userId,
    accountId
  );

  try {
    await verifySmtp({
      host: account.host,
      port: account.port,
      secure: account.secure,
      username: account.username,
      password: account.password,
    });
  } catch (error) {
    console.error("SMTP verification failed:", error);

    throw new AppError(
      "SMTP verification failed",
      502
    );
  }

  return {
    success: true,
  };
}


function sanitize(account) {
  const object = account.toObject();

  delete object.encryptedPassword;

  return object;
}

module.exports = {
  createEmailAccount,
  getEmailAccounts,
  getEmailAccount,
  getEmailAccountCredentials,
  getEmailAccountForSending,
  getPublicEmailAccountForSending,
  updateEmailAccount,
  deleteEmailAccount,
  testEmailAccount,
};


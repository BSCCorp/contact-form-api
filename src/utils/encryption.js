const crypto = require("crypto");

const ALGORITHM = "aes-256-gcm";

function getKey() {
  return crypto
    .createHash("sha256")
    .update(process.env.EMAIL_ENCRYPTION_KEY)
    .digest();
}

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const key = getKey();

  const cipher = crypto.createCipheriv(
    ALGORITHM,
    key,
    iv
  );

  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return [
    iv.toString("hex"),
    authTag.toString("hex"),
    encrypted.toString("hex"),
  ].join(":");
}

function decrypt(value) {
  const [
    ivHex,
    authTagHex,
    encryptedHex,
  ] = value.split(":");

  const key = getKey();

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    key,
    Buffer.from(ivHex, "hex")
  );

  decipher.setAuthTag(
    Buffer.from(authTagHex, "hex")
  );

  const decrypted = Buffer.concat([
    decipher.update(
      Buffer.from(encryptedHex, "hex")
    ),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}

module.exports = {
  encrypt,
  decrypt,
};


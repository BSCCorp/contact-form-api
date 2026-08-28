const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const AppError = require("../../utils/AppError");

const User = require("../users/user.model");

async function register({ name, email, password }) {
  const normalizedEmail = email.toLowerCase();

  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    throw new AppError(
      "Email already registered",
      409
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.create({
    name,
    email: normalizedEmail,
    passwordHash,
  });

  return {
    user: sanitizeUser(user),
    token: createToken(user),
  };
}

async function login({ email, password }) {
  const normalizedEmail = email.toLowerCase();

  const user = await User.findOne({
    email: normalizedEmail,
  });

  // Don't reveal whether the email exists.
  if (!user) {
    throw new AppError(
      "Invalid email or password",
      401
    );
  }

  const passwordValid = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!passwordValid) {
    throw new AppError(
      "Invalid email or password",
      401
    );
  }

  return {
    user: sanitizeUser(user),
    token: createToken(user),
  };
}

function createToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
}

function sanitizeUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

module.exports = {
  register,
  login,
};


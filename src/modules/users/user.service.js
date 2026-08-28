const User = require("./user.model");

async function getUserById(id) {
  const user = await User.findById(id).select("-passwordHash");

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
}

async function createUser({ name, email, passwordHash }) {
  const user = await User.create({
    name,
    email,
    passwordHash,
  });

  return user;
}

module.exports = {
  getUserById,
  createUser,
};


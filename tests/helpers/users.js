const bcrypt = require("bcrypt");
const User = require("../../src/modules/users/user.model");

async function createTestUser() {
  const password = "password123";

  const passwordHash = await bcrypt.hash(
    password,
    12
  );

  return User.create({
    name: "Jane Doe",
    email: `jane-${Date.now()}@example.com`,
    passwordHash,
  });
}

module.exports = {
  createTestUser,
};


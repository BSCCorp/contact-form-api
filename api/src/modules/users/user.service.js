const User = require("./user.model");
const AppError = require("../../utils/AppError");

async function getUserById(id) {
  const user = await User.findById(id).select("-passwordHash");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

module.exports = {
  getUserById,
};


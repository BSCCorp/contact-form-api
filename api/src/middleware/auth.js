const jwt = require("jsonwebtoken");
const User = require("../modules/users/user.model");

async function authenticate(req, res, next) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Authentication required",
    });
  }

  const token = header.substring(7);

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(payload.sub).select(
      "-passwordHash"
    );

    if (!user) {
      return res.status(401).json({
        error: "User no longer exists",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      error: "Invalid or expired token",
    });
  }
}

module.exports = authenticate;


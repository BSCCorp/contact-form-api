const authService = require("./auth.service");

async function register(req, res, next) {
  try {
    const result = await authService.register(req.body);

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function me(req, res) {
  res.json({
    user: {
      id: req.user._id.toString(),
      name: req.user.name,
      email: req.user.email,
      createdAt: req.user.createdAt,
      updatedAt: req.user.updatedAt,
    },
  });
}

module.exports = {
  register,
  login,
  me,
};


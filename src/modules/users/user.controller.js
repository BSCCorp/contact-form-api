const userService = require("./user.service");

async function getUser(req, res, next) {
  try {
    const user = await userService.getUserById(req.params.id);

    res.json(user);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getUser,
};


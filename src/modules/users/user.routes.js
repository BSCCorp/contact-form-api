const express = require("express");

const {
  getUser,
} = require("./user.controller");

const authenticate = require("../../middleware/auth");

const router = express.Router();

router.get(
  "/:id",
  authenticate,
  getUser
);

module.exports = router;


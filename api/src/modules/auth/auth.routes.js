const express = require("express");

const {
  register,
  login,
  me,
} = require("./auth.controller");

const validate = require("../../middleware/validate");
const authenticate = require("../../middleware/auth");

const {
  registerSchema,
  loginSchema,
} = require("./auth.validation");

const router = express.Router();

router.post(
  "/register",
  validate(registerSchema),
  register
);

router.post(
  "/login",
  validate(loginSchema),
  login
);

router.get(
  "/me",
  authenticate,
  me
);

module.exports = router;


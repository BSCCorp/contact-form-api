const express = require("express");

const {
  getUser,
} = require("./user.controller");

const authenticate = require("../../middleware/auth");
const validate = require("../../middleware/validate");

const {
  getUserParamsSchema,
} = require("./user.validation");

const router = express.Router();

router.get(
  "/:id",
  authenticate,
  validate(getUserParamsSchema, "params"),
  getUser
);

module.exports = router;


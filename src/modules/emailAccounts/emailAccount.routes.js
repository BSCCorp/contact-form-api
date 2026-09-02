// src/modules/emailAccounts/emailAccount.routes.js

const express = require("express");
const authenticate = require("../../middleware/auth.js");
const validate = require("../../middleware/validate.js");

const {
  createEmailAccountSchema,
  updateEmailAccountSchema,
  emailAccountIdSchema,
} = require("./emailAccount.validation.js");

const controller = require("./emailAccount.controller");

const router = express.Router();

router.use(authenticate);

router.post(
  "/",
  validate(createEmailAccountSchema, "body"),
  controller.create
);

router.get(
  "/",
  controller.list
);

router.get(
  "/:id",
  validate(emailAccountIdSchema, "params"),
  controller.get,
);

router.put(
  "/:id",
  validate(updateEmailAccountSchema, "body"),
  controller.update
);

router.delete(
  "/:id",
  controller.remove
);

router.post(
  "/:id/test",
  controller.test
);

module.exports = router;

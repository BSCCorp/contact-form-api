// src/modules/contactForms/contactForm.routes.js

const express = require("express");
const authenticate = require("../../middleware/auth.js");
const validate = require("../../middleware/validate.js");

const {
  createContactFormSchema,
  contactFormIdSchema,
} = require("./contactForm.validation.js");

const {
  create,
  list,
  getOne,
  remove,
} = require("./contactForm.controller.js");

const router = express.Router();

router.use(authenticate);

router.post(
  "/",
  validate(createContactFormSchema, "body"),
  create
);

router.get("/", list);

router.get(
  "/:id",
  validate(contactFormIdSchema, "params"),
  getOne
);

router.delete(
  "/:id",
  validate(contactFormIdSchema, "params"),
  remove
);

module.exports = router;


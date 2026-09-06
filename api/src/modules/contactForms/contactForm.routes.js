const express = require("express");
const path = require("path");
const authenticate = require("../../middleware/auth.js");
const validate = require("../../middleware/validate.js");

const {
  createContactFormSchema,
  publicContactFormSchema,
  contactFormIdSchema,
} = require("./contactForm.validation.js");

const {
  create,
  createPublic,
  list,
  getOne,
  remove,
} = require("./contactForm.controller.js");

const router = express.Router();

// Public submission MUST come before authenticated routes
router.post(
  "/public/:publicId",
  validate(publicContactFormSchema, "body"),
  createPublic
);

router.get(
  "/public/success",
  (req, res) => {
    res.sendFile(
      path.join(
        __dirname,
        "../../public/contact-form-success.html"
      )
    );
  }
);

// Everything below here requires authentication
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

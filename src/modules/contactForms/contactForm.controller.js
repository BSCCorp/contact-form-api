// src/modules/contactForms/contactForm.controller.js

const contactFormService = require("./contactForm.service.js");

async function create(
  req,
  res,
  next
) {
  try {
    const contactForm =
      await contactFormService.createContactForm(
        req.user.id,
        req.body
      );

    res.status(201).json(contactForm);
  } catch (error) {
    next(error);
  }
}

async function list(
  req,
  res,
  next
) {
  try {
    const forms =
      await contactFormService.getContactForms(
        req.user.id
      );

    res.json(forms);
  } catch (error) {
    next(error);
  }
}

async function getOne(req, res, next) {
  try {
    const contactForm =
      await contactFormService.getContactForm(
        req.user.id,
        req.params.id
      );

    res.json(contactForm);
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    await contactFormService.deleteContactForm(
      req.user.id,
      req.params.id
    );

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  create,
  list,
  getOne,
  remove,
};



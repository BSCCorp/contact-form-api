const contactFormService = require("./contactForm.service.js");

async function create(req, res, next) {
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

async function createPublic(req, res, next) {
  try {
    const result =
      await contactFormService.createPublicContactForm(
        req.params.publicId,
        req.body
      );

    /*
     * Only redirect back to the configured origin when the
     * submission explicitly includes allowedOrigin.
     *
     * The submitted value is NOT trusted. The service returns
     * the origin configured on the email account.
     */
    if (
      req.body.allowedOrigin &&
      result.allowedOrigin
    ) {
      return res.redirect(
        303,
        `/api/contact-forms/public/success?origin=${encodeURIComponent(
          result.allowedOrigin
        )}`
      );
    }

    return res.redirect(
      303,
      "/api/contact-forms/public/success"
    );
  } catch (error) {
    next(error);
  }
}

async function list(req, res, next) {
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
  createPublic,
  list,
  getOne,
  remove,
};


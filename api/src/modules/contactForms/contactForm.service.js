const ContactForm = require("./contactForm.model.js");
const AppError = require("../../utils/AppError.js");
const { sendMail } = require("../../services/email.service.js");
const EmailAccount = require("../emailAccounts/emailAccount.model.js");
const {
  getEmailAccountForSending,
  getPublicEmailAccountForSending,
} = require("../emailAccounts/emailAccount.service.js");

async function createContactForm(userId, data) {
  const emailAccount =
    await getEmailAccountForSending(
      userId,
      data.emailAccountId
    );

  const contactForm = await ContactForm.create({
    ...data,
    userId,
    deliveryStatus: "pending",
  });

  try {
    await sendMail(
      {
        host: emailAccount.host,
        port: emailAccount.port,
        secure: emailAccount.secure,
        username: emailAccount.username,
        password: emailAccount.password,
      },
      {
        from: emailAccount.from,
        to: emailAccount.username,
        replyTo: contactForm.email,
        subject: contactForm.subject,
        text: [
          `Name: ${contactForm.name}`,
          `Email: ${contactForm.email}`,
          `Subject: ${contactForm.subject}`,
          "",
          contactForm.message,
        ].join("\n"),
      }
    );

    contactForm.deliveryStatus = "sent";

    await contactForm.save();
  } catch (error) {
    contactForm.deliveryStatus = "failed";
    contactForm.deliveryError = error.message;

    await contactForm.save();

    throw error;
  }

  return contactForm;
}

async function createPublicContactForm(
  publicId,
  data
) {
  const account =
    await getPublicEmailAccountForSending(
      publicId
    );

  const recipient =
    account.from || account.username;

  const contactForm =
    await ContactForm.create({
      userId: account.userId,
      emailAccountId: account._id,
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
    });

  try {
    await sendMail(
      {
        host: account.host,
        port: account.port,
        secure: account.secure,
        username: account.username,
        password: account.password,
      },
      {
        from: recipient,
        to: recipient,
        replyTo: data.email,
        subject: data.subject,
        text: [
          `Name: ${data.name}`,
          `Email: ${data.email}`,
          "",
          data.message,
        ].join("\n"),
      }
    );

    contactForm.deliveryStatus = "sent";
    contactForm.deliveryError = undefined;

  } catch (error) {
    contactForm.deliveryStatus = "failed";
    contactForm.deliveryError = error.message;

    await contactForm.save();

    throw new AppError(
      "Failed to send contact form",
      502
    );
  }

  await contactForm.save();

  return contactForm;
}


async function getContactForms(userId) {
  return ContactForm.find({ userId })
    .sort({ createdAt: -1 })
    .lean();
}

async function getContactForm(userId, contactFormId) {
  const contactForm = await ContactForm.findOne({
    _id: contactFormId,
    userId,
  }).lean();

  if (!contactForm) {
    throw new AppError(
      "Contact form not found",
      404
    );
  }

  return contactForm;
}

async function deleteContactForm(
  userId,
  contactFormId
) {
  const contactForm =
    await ContactForm.findOneAndDelete({
      _id: contactFormId,
      userId,
    });

  if (!contactForm) {
    throw new AppError(
      "Contact form not found",
      404
    );
  }
}

module.exports = {
  createContactForm,
  createPublicContactForm,
  getContactForms,
  getContactForm,
  deleteContactForm,
};


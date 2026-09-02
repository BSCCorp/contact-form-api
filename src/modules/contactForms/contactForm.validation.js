const { z } = require("zod");

const objectId = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid ID");

const createContactFormSchema = z.object({
  emailAccountId: objectId,

  name: z
    .string()
    .trim()
    .min(1)
    .max(100),

  email: z
    .string()
    .trim()
    .email()
    .max(320),

  subject: z
    .string()
    .trim()
    .min(1)
    .max(200),

  message: z
    .string()
    .trim()
    .min(1)
    .max(5000),
});

const contactFormIdSchema = z.object({
  id: objectId,
});

module.exports = {
  createContactFormSchema,
  contactFormIdSchema,
};


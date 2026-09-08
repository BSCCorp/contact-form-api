const { z } = require("zod");

const createContactFormSchema = z.object({
  emailAccountId: z.string().regex(
    /^[0-9a-fA-F]{24}$/,
    "Invalid email account ID"
  ),

  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100),

  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .max(320),

  subject: z
    .string()
    .trim()
    .min(1, "Subject is required")
    .max(200),

  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(5000),
});

const publicContactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100),

  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .max(320),

  subject: z
    .string()
    .trim()
    .min(1, "Subject is required")
    .max(200),

  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(5000),

  /*
   * This field is only used to indicate that the form wants
   * the success page to redirect back to the configured origin.
   *
   * The server NEVER trusts this value as the redirect target.
   */
  allowedOrigin: z
    .string()
    .trim()
    .url()
    .optional(),
});

const contactFormIdSchema = z.object({
  id: z.string().regex(
    /^[0-9a-fA-F]{24}$/,
    "Invalid contact form ID"
  ),
});

module.exports = {
  createContactFormSchema,
  publicContactFormSchema,
  contactFormIdSchema,
};


const { z } = require("zod");

const emailSchema = z
  .string()
  .trim()
  .email()
  .max(320);

const baseEmailAccountSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1)
    .max(100),

  host: z
    .string()
    .trim()
    .min(1)
    .max(255),

  port: z
    .number()
    .int()
    .min(1)
    .max(65535),

  secure: z.boolean(),

  username: emailSchema,

  password: z
    .string()
    .min(1)
    .max(1000),

  from: emailSchema,
});

const createEmailAccountSchema =
  baseEmailAccountSchema;

const updateEmailAccountSchema =
  baseEmailAccountSchema
    .partial()
    .refine(
      (value) => Object.keys(value).length > 0,
      "At least one field is required"
    );

const emailAccountIdSchema = z.object({
  id: z
    .string()
    .regex(
      /^[a-f\d]{24}$/i,
      "Invalid email account ID"
    ),
});

module.exports = {
  createEmailAccountSchema,
  updateEmailAccountSchema,
  emailAccountIdSchema,
};


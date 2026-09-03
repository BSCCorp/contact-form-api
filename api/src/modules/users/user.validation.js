const { z } = require("zod");

const getUserParamsSchema = z.object({
  id: z.string().regex(
    /^[a-f\d]{24}$/i,
    "Invalid user ID"
  ),
});

module.exports = {
  getUserParamsSchema,
};


const mongoose = require("mongoose");

const contactFormSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    emailAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmailAccount",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 320,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },

    deliveryStatus: {
      type: String,
      enum: [
        "pending",
        "sent",
        "failed",
      ],
      default: "pending",
    },

    deliveryError: {
      type: String,
    },

  },
  {
    timestamps: true,
  }
);

contactFormSchema.index({
  userId: 1,
  createdAt: -1,
});

module.exports = mongoose.model(
  "ContactForm",
  contactFormSchema
);


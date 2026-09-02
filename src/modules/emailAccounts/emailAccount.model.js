const mongoose = require("mongoose");

const emailAccountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    host: {
      type: String,
      required: true,
      trim: true,
    },

    port: {
      type: Number,
      required: true,
    },

    secure: {
      type: Boolean,
      default: false,
    },

    username: {
      type: String,
      required: true,
      trim: true,
    },

    encryptedPassword: {
      type: String,
      required: true,
    },

    from: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "EmailAccount",
  emailAccountSchema
);


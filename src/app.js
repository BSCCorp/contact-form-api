const express = require("express");

const authRoutes = require("./modules/auth/auth.routes");
const userRoutes = require("./modules/users/user.routes");
const emailAccountRoutes = require("./modules/emailAccounts/emailAccount.routes");
const contactFormRoutes = require("./modules/contactForms/contactForm.routes");

const errorHandler = require("./middleware/error");

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/email-accounts", emailAccountRoutes);
app.use("/api/contact-forms", contactFormRoutes);

app.use(errorHandler);

module.exports = app;


require("dotenv").config({
  path: ".env.test",
});

const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",

  use: {
    baseURL: "http://localhost:3000",
  },

  webServer: {
    command: "npm run start",
    url: "http://localhost:3000/health",
    reuseExistingServer: true,
  },
});


require("dotenv").config({
  path: ".env.test",
});

const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  workers: 1,

  use: {
    baseURL: "http://localhost:3000",
  },

  webServer: [
    {
      command: "npm run start",
      url: "http://localhost:3000/health",
      reuseExistingServer: true,
    },
    {
      command: "maildev --smtp 1025 --web 1080",
      url: "http://127.0.0.1:1080",
      reuseExistingServer: true,
    },
  ]
});


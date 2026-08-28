const {
  test: base,
  expect,
} = require("@playwright/test");

const mongoose = require("mongoose");

async function clearDatabase() {
  const collections = mongoose.connection.collections;

  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
}

const test = base.extend({
  database: [
    async ({}, use) => {
      const uri = process.env.MONGODB_URI;

      if (!uri) {
        throw new Error(
          "MONGODB_URI is not defined"
        );
      }

      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(uri);
      }

      await clearDatabase();

      await use();

      await clearDatabase();
    },
    { auto: true },
  ],
});

module.exports = {
  test,
  expect,
};


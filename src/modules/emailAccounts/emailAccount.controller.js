const emailAccountService = require("./emailAccount.service.js");

async function create(req, res) {
  const account = await emailAccountService.createEmailAccount(
    req.user.id,
    req.body
  );

  res.status(201).json({
    data: account,
  });
}

async function list(req, res) {
  const accounts = await emailAccountService.getEmailAccounts(
    req.user.id
  );

  res.json({
    data: accounts,
  });
}

async function get(req, res) {
  const account = await emailAccountService.getEmailAccount(
    req.user.id,
    req.params.id
  );

  res.json({
    data: account,
  });
}

async function update(req, res) {
  const account = await emailAccountService.updateEmailAccount(
    req.user.id,
    req.params.id,
    req.body
  );

  res.json({
    data: account,
  });
}

async function remove(req, res) {
  await emailAccountService.deleteEmailAccount(
    req.user.id,
    req.params.id
  );

  res.status(204).send();
}

async function test(req, res) {
  const result = await emailAccountService.testEmailAccount(
    req.user.id,
    req.params.id
  );

  res.json({
    data: result,
  });
}

module.exports = {
  create,
  list,
  get,
  update,
  remove,
  test,
};


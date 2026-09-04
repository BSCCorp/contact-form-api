function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;

  if (!err.isOperational || status >= 500) {
    console.error(err);
  }

  res.status(status).json({
    error: err.isOperational
      ? err.message
      : "Internal server error",
  });
}

module.exports = errorHandler;


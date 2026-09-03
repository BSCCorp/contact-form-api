function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;

  if (!err.isOperational || status >= 500) {
    console.error(err);
  }

  res.status(status).json({
    error:
      status >= 500
        ? "Internal server error"
        : err.message,
  });
}

module.exports = errorHandler;


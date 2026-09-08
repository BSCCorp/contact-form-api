function normalizeOrigin(value) {
  if (typeof value !== "string") {
    throw new Error("Origin must be a string");
  }

  const url = new URL(value.trim());

  if (
    url.protocol !== "http:" &&
    url.protocol !== "https:"
  ) {
    throw new Error(
      "Origin must use HTTP or HTTPS"
    );
  }

  if (
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      "Value must be an origin"
    );
  }

  return url.origin;
}

module.exports = {
  normalizeOrigin,
};


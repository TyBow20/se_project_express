// function errorHandler(err, req, res, next) {
//   console.error(err.stack);
//   res.status(500).json({ error: "Something went wrong!" });
// }

// module.exports = errorHandler;

function errorHandler(err, req, res, next) {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong!";

  res.status(statusCode).json({ error: message });
}

module.exports = errorHandler;

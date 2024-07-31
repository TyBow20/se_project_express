const NotFoundError = require("./NotFoundError");
const ForbiddenError = require("./ForbiddenError");
const InvalidDataError = require("./InvalidDataError");
const ServerError = require("./ServerError");
const ConflictError = require("./ConflictError");
const UnauthorizedError = require("./UnauthorizedError");

// const ERROR_CODES = {
//   INVALID_DATA: 400,
//   NOT_FOUND: 404,
//   UNAUTHORIZED: 401,
//   FORBIDDEN: 403,
//   CONFLICT: 409,
//   SERVER_ERROR: 500,
// };

module.exports = {
  // ERROR_CODES,
  NotFoundError,
  ForbiddenError,
  InvalidDataError,
  ServerError,
  ConflictError,
  UnauthorizedError,
};

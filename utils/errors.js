// const ERROR_CODES = {
//   INVALID_DATA: 400,
//   NOT_FOUND: 404,
//   UNAUTHORIZED: 401,
//   FORBIDDEN: 403,
//   CONFLICT: 409,
//   SERVER_ERROR: 500,
// };

// module.exports = ERROR_CODES;

const ERROR_CODES = {
  INVALID_DATA: 400,
  NOT_FOUND: 404,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  CONFLICT: 409,
  SERVER_ERROR: 500,
};

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODES.NOT_FOUND;
  }
}

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODES.FORBIDDEN;
  }
}

class InvalidDataError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODES.INVALID_DATA;
  }
}

class ServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODES.SERVER_ERROR;
  }
}

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODES.CONFLICT;
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODES.UNAUTHORIZED;
  }
}

module.exports = {
  ERROR_CODES,
  NotFoundError,
  ForbiddenError,
  InvalidDataError,
  ServerError,
  ConflictError,
  UnauthorizedError,
};

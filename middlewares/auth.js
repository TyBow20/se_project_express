// const jwt = require("jsonwebtoken");
// const { JWT_SECRET } = require("../utils/config");
// const { UnauthorizedError } = require("../utils/errors");

// const auth = (req, res, next) => {
//   try {
//     const { authorization } = req.headers;

//     if (!authorization || !authorization.startsWith("Bearer ")) {
//       throw new UnauthorizedError("Authorization token missing or malformed");
//     }

//     const token = authorization.replace("Bearer ", "");
//     const payload = jwt.verify(token, JWT_SECRET);
//     req.user = payload;

//     next();
//   } catch (error) {
//     next(error);
//   }
// };

// module.exports = auth;

// new code

const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UnauthorizedError } = require("../errors");

const auth = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      throw new UnauthorizedError("Authorization token missing or malformed");
    }

    const token = authorization.replace("Bearer ", "");
    const payload = jwt.verify(token, JWT_SECRET);

    req.user = payload;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError("Authorization token missing or malformed"));
    } else {
      next(error);
    }
  }
};

module.exports = auth;

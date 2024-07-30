// const jwt = require("jsonwebtoken");
// const { JWT_SECRET } = require("../utils/config");
// const ERROR_CODES = require("../utils/errors");

// const auth = (req, res, next) => {
//   try {
//     const { authorization } = req.headers;

//     if (!authorization || !authorization.startsWith("Bearer ")) {
//       throw new Error("Authorization token missing or malformed");
//     }

//     const token = authorization.replace("Bearer ", "");
//     const payload = jwt.verify(token, JWT_SECRET);
//     req.user = payload;

//     next();
//   } catch (error) {
//     res.status(ERROR_CODES.UNAUTHORIZED).json({ message: "Not authorized" });
//   }
// };

// module.exports = auth;

const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UnauthorizedError } = require("../utils/errors");

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
    next(error);
  }
};

module.exports = auth;

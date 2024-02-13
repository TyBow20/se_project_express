const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const ERROR_CODES = {
  INVALID_DATA: 400,
  NOT_FOUND: 404,
  UNAUTHORIZED: 401,
  CONFLICT: 409,
  SERVER_ERROR: 500,
};

const auth = (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      throw new Error("Authorization token missing or malformed");
    }

    const token = authorization.replace("Bearer ", "");
    const payload = jwt.verify(token, JWT_SECRET);

    req.user = payload;

    next();
  } catch (error) {
    res.status(ERROR_CODES.UNAUTHORIZED).json({ message: "Not authorized" });
  }
};

module.exports = auth;

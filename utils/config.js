// utils/config.js

// module.exports = {
//   JWT_SECRET: process.env.JWT_SECRET || "secret",
// };

const { JWT_SECRET = "super-strong-secret" } = process.env;

module.exports = {
  JWT_SECRET,
};

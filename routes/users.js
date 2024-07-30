const express = require("express");
const {
  userValidation,
  loginValidation,
  idValidation,
  updateUserValidation,
} = require("../middlewares/validation");
const {
  createUser,
  login,
  getCurrentUser,
  updateProfile,
} = require("../controllers/users");

const router = express.Router();

//router.post("/signup", userValidation, createUser);
//router.post("/signin", loginValidation, login);
router.get("/me", getCurrentUser);
router.patch("/me", updateUserValidation, updateProfile);

module.exports = router;

// const express = require("express");
// const {
//   userValidation,
//   idValidation,
//   updateUserValidation,
// } = require("../middlewares/validation");
// const {
//   createUser,
//   login,
//   getCurrentUser,
//   updateProfile,
// } = require("../controllers/users");

// const router = express.Router();

// router.get("/me", getCurrentUser);
// router.patch("/me", updateUserValidation, updateProfile);

// module.exports = router;

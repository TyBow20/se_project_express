// const express = require("express");

// const router = express.Router();
// const auth = require("../middlewares/auth");
// const { getCurrentUser, updateProfile } = require("../controllers/users");

// router.get("/me", auth, getCurrentUser);

// router.patch("/me", auth, updateProfile);

// module.exports = router;

//new code

const express = require("express");
const {
  userValidation,
  loginValidation,
  idValidation,
} = require("../middlewares/validation");
const {
  createUser,
  login,
  getCurrentUser,
  updateProfile,
} = require("../controllers/users");

const router = express.Router();

router.post("/signup", userValidation, createUser);
router.post("/signin", loginValidation, login);
router.get("/me", getCurrentUser);
router.patch("/me", userValidation, updateProfile);

module.exports = router;

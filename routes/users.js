// const express = require("express");

// const router = express.Router();

// const { getUsers, getUser, createUser } = require("../controllers/users");

// GET all users
// router.get("/", getUsers);

// GET a single user by _id
// router.get("/:userId", getUser);

// POST a new user
// router.post("/", createUser);

// module.exports = router;

// new code

const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { getCurrentUser, updateProfile } = require("../controllers/users");

router.get("/me", auth, getCurrentUser);

router.patch("/me", auth, updateProfile);

module.exports = router;

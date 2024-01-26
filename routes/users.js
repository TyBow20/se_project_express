const express = require("express");
const router = express.Router();
const User = require("../models/user");
const ERROR_CODES = require("../utils/errors");
const { getUsers, getUser, createUser } = require("../controllers/users");

// GET all users
router.get("/", getUsers);

// GET a single user by _id
router.get("/:userId", getUser);

// POST a new user
router.post("/", createUser);

router.post("/create", (req, res) => {
  User.create(req.body)
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(ERROR_CODES.INVALID_DATA)
          .send({ message: "Invalid user data provided" });
      } else {
        return res
          .status(ERROR_CODES.SERVER_ERROR)
          .send({ message: "An error has occurred on the server" });
      }
    });
});

module.exports = router;

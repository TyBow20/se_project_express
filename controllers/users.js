const User = require("../models/user");

const ERROR_CODES = {
  INVALID_DATA: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

// GET all users
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).json(users))
    .catch(() =>
      res
        .status(ERROR_CODES.SERVER_ERROR)
        .json({ message: "Error fetching users" }),
    );
};

// GET a single user by _id

const getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res
          .status(ERROR_CODES.NOT_FOUND)
          .json({ message: "User not found" });
      }
      res.status(200).json(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(ERROR_CODES.INVALID_DATA)
          .json({ message: "Invalid ID format" });
      }
      res
        .status(ERROR_CODES.SERVER_ERROR)
        .json({ message: "Error fetching user" });
    });
};

// POST a new user
const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(ERROR_CODES.INVALID_DATA)
          .send({ message: "Invalid user data provided" });
      }
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = { createUser, getUsers, getUser };

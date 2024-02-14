const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { JWT_SECRET } = require("../utils/config");
const ERROR_CODES = require("../utils/errors");

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

//old createUser code
// const createUser = (req, res) => {
//   const { name, avatar } = req.body;
//   User.create({ name, avatar })
//     .then((user) => res.send(user))
//     .catch((err) => {
//       console.error(err);
//       if (err.name === "ValidationError") {
//         return res
//           .status(ERROR_CODES.INVALID_DATA)
//           .send({ message: "Invalid user data provided" });
//       }
//       return res
//         .status(ERROR_CODES.SERVER_ERROR)
//         .send({ message: "An error has occurred on the server" });
//     });
// };

// POST a new user
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return res
          .status(ERROR_CODES.CONFLICT)
          .json({ message: "User with this email already exists" });
      }
      return User.create({ name, avatar, email, password });
    })
    .then((user) => res.status(201).json(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(ERROR_CODES.INVALID_DATA)
          .json({ message: "Invalid user data provided" });
      } else if (err.code === 11000) {
        return res
          .status(ERROR_CODES.CONFLICT)
          .json({ message: "User with this email already exists" });
      } else {
        return res
          .status(ERROR_CODES.SERVER_ERROR)
          .json({ message: "An error has occurred on the server" });
      }
    });
};

// log in a user

const login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id.toString() }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).json({ token });
    })
    .catch(() => {
      res
        .status(ERROR_CODES.UNAUTHORIZED)
        .json({ message: "Incorrect email or password" });
    });
};

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return res
          .status(ERROR_CODES.NOT_FOUND)
          .json({ message: "User not found" });
      }
      res.status(200).json(user);
    })
    .catch((err) => {
      console.error(err);
      res
        .status(ERROR_CODES.SERVER_ERROR)
        .json({ message: "Error fetching current user" });
    });
};

const updateProfile = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "avatar"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update),
  );

  if (!isValidOperation) {
    return res
      .status(ERROR_CODES.INVALID_DATA)
      .json({ message: "Invalid updates!" });
  }

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res
        .status(ERROR_CODES.NOT_FOUND)
        .json({ message: "User not found" });
    }

    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(ERROR_CODES.INVALID_DATA).json({ message: error.message });
    } else {
      console.error(error);
      res
        .status(ERROR_CODES.SERVER_ERROR)
        .json({ message: "Error updating user profile" });
    }
  }
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  login,
  getCurrentUser,
  updateProfile,
};

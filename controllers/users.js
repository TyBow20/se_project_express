const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const ERROR_CODES = require("../utils/errors");

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
    .then((user) => {
      const userObj = user.toObject();
      delete userObj.password;
      res.status(201).json(userObj);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        res
          .status(ERROR_CODES.INVALID_DATA)
          .json({ message: "Invalid user data provided" });
      } else if (err.code === 11000) {
        res
          .status(ERROR_CODES.CONFLICT)
          .json({ message: "User with this email already exists" });
      } else {
        res
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
    .catch((error) => {
      console.error("Login error: ", error);
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

    updates.forEach((update) => {
      user[update] = req.body[update];
    });
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
  // getUsers,
  // getUser,
  login,
  getCurrentUser,
  updateProfile,
};

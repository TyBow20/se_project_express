const User = require("../models/user");

// GET all users
exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).json(users))
    .catch((err) =>
      res.status(500).json({ message: "Error fetching users", error: err }),
    );
};

// GET a single user by _id
exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    })
    .catch((err) =>
      res.status(500).json({ message: "Error fetching user", error: err }),
    );
};

// POST a new user
exports.createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(201).json(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .json({ message: "Invalid user data provided", error: err });
      }
      res.status(500).json({ message: "Error creating user", error: err });
    });
};

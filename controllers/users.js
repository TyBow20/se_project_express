// const jwt = require("jsonwebtoken");
// const User = require("../models/user");
// const { JWT_SECRET } = require("../utils/config");
// const {
//   NotFoundError,
//   InvalidDataError,
//   ServerError,
//   ConflictError,
//   UnauthorizedError,
// } = require("../utils/errors");

// const createUser = (req, res, next) => {
//   const { name, avatar, email, password } = req.body;

//   User.findOne({ email })
//     .then((existingUser) => {
//       if (existingUser) {
//         throw new ConflictError("User with this email already exists");
//       }

//       return User.create({ name, avatar, email, password }).then((user) => {
//         const userObj = user.toObject();
//         delete userObj.password;
//         res.status(201).json(userObj);
//       });
//     })
//     .catch((err) => {
//       if (err.name === "ValidationError") {
//         next(new InvalidDataError("Invalid user data provided"));
//       } else if (err.code === 11000) {
//         next(new ConflictError("User with this email already exists"));
//       } else {
//         next(new ServerError("An error has occurred on the server"));
//       }
//     });
// };

// const login = (req, res, next) => {
//   const { email, password } = req.body;

//   User.findUserByCredentials(email, password)
//     .then((user) => {
//       const token = jwt.sign({ _id: user._id.toString() }, JWT_SECRET, {
//         expiresIn: "7d",
//       });
//       res.status(200).json({ token });
//     })
//     .catch(() => {
//       next(new UnauthorizedError("Incorrect email or password"));
//     });
// };

// const getCurrentUser = (req, res, next) => {
//   User.findById(req.user._id)
//     .then((user) => {
//       if (!user) {
//         throw new NotFoundError("User not found");
//       }
//       res.status(200).json(user);
//     })
//     .catch(() => {
//       next(new ServerError("Error fetching current user"));
//     });
// };

// const updateProfile = async (req, res, next) => {
//   const updates = Object.keys(req.body);
//   const allowedUpdates = ["name", "avatar"];
//   const isValidOperation = updates.every((update) =>
//     allowedUpdates.includes(update),
//   );

//   if (!isValidOperation) {
//     return next(new InvalidDataError("Invalid updates!"));
//   }

//   try {
//     const user = await User.findById(req.user._id);
//     if (!user) {
//       throw new NotFoundError("User not found");
//     }

//     updates.forEach((update) => {
//       user[update] = req.body[update];
//     });
//     await user.save();
//     res.status(200).json(user);
//   } catch (error) {
//     if (error.name === "ValidationError") {
//       next(new InvalidDataError("Invalid user data provided"));
//     } else {
//       next(new ServerError("Error updating user profile"));
//     }
//   }
// };

// module.exports = {
//   createUser,
//   login,
//   getCurrentUser,
//   updateProfile,
// };

// updated code

const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  NotFoundError,
  InvalidDataError,
  ServerError,
  ConflictError,
  UnauthorizedError,
} = require("../errors");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        throw new ConflictError("User with this email already exists");
      }

      return User.create({ name, avatar, email, password }).then((user) => {
        const userObj = user.toObject();
        delete userObj.password;
        res.status(201).json(userObj);
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new InvalidDataError("Invalid user data provided"));
      } else if (err.code === 11000) {
        next(new ConflictError("User with this email already exists"));
      } else if (err.statusCode) {
        next(err);
      } else {
        next(new ServerError("An error has occurred on the server"));
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id.toString() }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).json({ token });
    })
    .catch((err) => {
      if (err.message === "Unable to login") {
        next(new UnauthorizedError("Incorrect email or password"));
      } else {
        next(err);
      }
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("User not found");
      }
      res.status(200).json(user);
    })
    .catch((err) => {
      if (err.statusCode) {
        next(err);
      } else {
        next(new ServerError("Error fetching current user"));
      }
    });
};

const updateProfile = async (req, res, next) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "avatar"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update),
  );

  if (!isValidOperation) {
    return next(new InvalidDataError("Invalid updates!"));
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    updates.forEach((update) => {
      user[update] = req.body[update];
    });
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    if (error.name === "ValidationError") {
      next(new InvalidDataError("Invalid user data provided"));
    } else if (error.statusCode) {
      next(error);
    } else {
      next(new ServerError("Error updating user profile"));
    }
  }
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateProfile,
};

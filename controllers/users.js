// const jwt = require("jsonwebtoken");
// const User = require("../models/user");
// const { JWT_SECRET } = require("../utils/config");
// const ERROR_CODES = require("../utils/errors");

// const createUser = (req, res, next) => {
//   console.log("console ran");
//   const { name, avatar, email, password } = req.body;

//   User.findOne({ email })
//     .then((existingUser) => {
//       if (existingUser) {
//         const error = new Error("User with this email already exists");
//         error.statusCode = ERROR_CODES.CONFLICT;
//         throw error;
//       }

//       return User.create({ name, avatar, email, password }).then((user) => {
//         const userObj = user.toObject();
//         delete userObj.password;
//         res.status(201).json(userObj);
//       });
//     })
//     .catch((err) => {
//       if (err.name === "ValidationError") {
//         err.statusCode = ERROR_CODES.INVALID_DATA;
//         err.message = "Invalid user data provided";
//       } else if (err.code === 11000) {
//         err.statusCode = ERROR_CODES.CONFLICT;
//         err.message = "User with this email already exists";
//       } else {
//         err.statusCode = ERROR_CODES.SERVER_ERROR;
//         err.message = "An error has occurred on the server";
//       }
//       next(err);
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
//     .catch((error) => {
//       error.statusCode = ERROR_CODES.UNAUTHORIZED;
//       error.message = "Incorrect email or password";
//       next(error);
//     });
// };

// const getCurrentUser = (req, res, next) => {
//   User.findById(req.user._id)
//     .then((user) => {
//       if (!user) {
//         const error = new Error("User not found");
//         error.statusCode = ERROR_CODES.NOT_FOUND;
//         throw error;
//       }
//       res.status(200).json(user);
//     })
//     .catch((err) => {
//       err.statusCode = ERROR_CODES.SERVER_ERROR;
//       err.message = "Error fetching current user";
//       next(err);
//     });
// };

// const updateProfile = async (req, res, next) => {
//   const updates = Object.keys(req.body);
//   const allowedUpdates = ["name", "avatar"];
//   const isValidOperation = updates.every((update) =>
//     allowedUpdates.includes(update),
//   );

//   if (!isValidOperation) {
//     const error = new Error("Invalid updates!");
//     error.statusCode = ERROR_CODES.INVALID_DATA;
//     return next(error);
//   }

//   try {
//     const user = await User.findById(req.user._id);
//     if (!user) {
//       const error = new Error("User not found");
//       error.statusCode = ERROR_CODES.NOT_FOUND;
//       throw error;
//     }

//     updates.forEach((update) => {
//       user[update] = req.body[update];
//     });
//     await user.save();
//     res.status(200).json(user);
//   } catch (error) {
//     if (error.name === "ValidationError") {
//       error.statusCode = ERROR_CODES.INVALID_DATA;
//     } else {
//       error.statusCode = ERROR_CODES.SERVER_ERROR;
//       error.message = "Error updating user profile";
//     }
//     next(error);
//   }
// };

// module.exports = {
//   createUser,
//   // getUsers,
//   // getUser,
//   login,
//   getCurrentUser,
//   updateProfile,
// };

const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  NotFoundError,
  InvalidDataError,
  ServerError,
  ConflictError,
  UnauthorizedError,
} = require("../utils/errors");

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
    .catch(() => {
      next(new UnauthorizedError("Incorrect email or password"));
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
    .catch(() => {
      next(new ServerError("Error fetching current user"));
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

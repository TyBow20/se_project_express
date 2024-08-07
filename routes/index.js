const router = require("express").Router();
const { celebrate, Joi, errors } = require("celebrate");

const auth = require("../middlewares/auth");

const {
  login,
  createUser,
  // getCurrentUser,
  // updateProfile,
} = require("../controllers/users");

const clothingItem = require("./clothingItems");
const users = require("./users");

const { NotFoundError } = require("../errors");

// Validation schemas
const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const createUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    avatar: Joi.string().uri().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

// Routes
router.use("/items", clothingItem);
router.use("/users", auth, users);

router.post("/signin", loginValidation, login);
router.post("/signup", createUserValidation, createUser);

// router.get("/users/me", auth, getCurrentUser);
// router.patch("/users/me", auth, updateProfile);

// Centralized error handling for unknown routes
router.use((req, res, next) => {
  next(new NotFoundError("Route not found!"));
});

// Celebrate error handler
router.use(errors());

module.exports = router;

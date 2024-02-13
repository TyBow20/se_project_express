const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  login,
  createUser,
  getCurrentUser,
  updateProfile,
} = require("../controllers/users");
const clothingItem = require("./clothingItems");
const users = require("./users");
const ERROR_CODES = require("../utils/errors");

router.use("/items", clothingItem);
// router.use("/users", users);
router.post("/signin", login);
router.post("/signup", createUser);

router.use("/users", auth, users);
router.get("/users/me", getCurrentUser);
router.patch("/users/me", auth, updateProfile);

router.use((req, res) => {
  res.status(ERROR_CODES.NOT_FOUND).send({ message: "Route not found!" });
});

module.exports = router;
